import express from "express";

const router = express.Router();

const officeLookup = {
  campbell: "Campbell Dental",
  vernor: "Vernor Dental",
  allenwood: "Allenwood Dental",
};

function stamp() {
  return new Date().toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

let tickets = [
  {
    id: "T-1",
    title: "X-ray sensor not detecting in OP-3",
    description: "Sensor intermittently not detected by PC. Happens mostly in the morning.",
    priority: "High",
    status: "New",
    officeId: "campbell",
    officeName: officeLookup.campbell,
    room: "OP-3",
    type: "Clinical",
    openedBy: "Jessica (RDH)",
    assignedTo: "IT Queue",
    time: stamp(),
    history: [
      {
        timestamp: stamp(),
        action: "Ticket created",
        user: "Jessica (RDH)",
        comment: "Sensor intermittently not detected by PC.",
      },
      {
        timestamp: stamp(),
        action: "Ticket routed to IT Queue",
        user: "System",
        comment: "",
      },
    ],
  },
  {
    id: "T-2",
    title: "Front desk computer restarting randomly",
    description: "Reboots 2–3 times per day while checking in patients.",
    priority: "Medium",
    status: "In progress",
    officeId: "vernor",
    officeName: officeLookup.vernor,
    room: "Front Desk",
    type: "IT",
    openedBy: "Lorena (FD)",
    assignedTo: "Manny (IT)",
    time: stamp(),
    history: [
      {
        timestamp: stamp(),
        action: "Ticket created",
        user: "Lorena (FD)",
        comment: "Reboots multiple times per day.",
      },
      {
        timestamp: stamp(),
        action: "Assigned to Manny (IT)",
        user: "Office Manager",
        comment: "Please prioritize before weekend.",
      },
      {
        timestamp: stamp(),
        action: "Status changed to In progress",
        user: "Manny (IT)",
        comment: "Running hardware diagnostics.",
      },
    ],
  },
  {
    id: "T-3",
    title: "Chair pedal not responding",
    description: "Chair does not move when foot pedal is pressed. Lights still work.",
    priority: "Low",
    status: "New",
    officeId: "allenwood",
    officeName: officeLookup.allenwood,
    room: "OP-2",
    type: "Maintenance",
    openedBy: "David (DA)",
    assignedTo: "Facilities",
    time: stamp(),
    history: [
      {
        timestamp: stamp(),
        action: "Ticket created",
        user: "David (DA)",
        comment: "Foot pedal dead, lights OK.",
      },
      {
        timestamp: stamp(),
        action: "Ticket routed to Facilities",
        user: "System",
        comment: "",
      },
    ],
  },
];

let nextId = 4;

// GET /api/tickets?officeId=campbell
router.get("/", (req, res) => {
  const { officeId } = req.query;
  let result = tickets;
  if (officeId) {
    result = result.filter((t) => t.officeId === officeId);
  }
  res.json(result);
});

// GET /api/tickets/:id
router.get("/:id", (req, res) => {
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  res.json(ticket);
});

// POST /api/tickets  (create new)
router.post("/", (req, res) => {
  const body = req.body || {};

  const officeId = body.officeId || "campbell";
  const officeName = officeLookup[officeId] || "Unknown office";

  const createdBy = body.openedBy || "Unknown";
  const assignedTo = body.assignedTo || "IT Queue";
  const createdAt = stamp();

  const ticket = {
    id: `T-${nextId++}`,
    title: body.title || "Untitled ticket",
    description: body.description || "",
    priority: body.priority || "Medium",
    status: body.status || "New",
    officeId,
    officeName,
    room: body.room || "",
    type: body.type || "IT",
    openedBy: createdBy,
    assignedTo,
    time: createdAt,
    history: [
      {
        timestamp: createdAt,
        action: "Ticket created",
        user: createdBy,
        comment: body.description || "",
      },
      {
        timestamp: stamp(),
        action: `Ticket routed to ${assignedTo}`,
        user: "System",
        comment: "",
      },
    ],
  };

  tickets.unshift(ticket);
  res.status(201).json(ticket);
});

// PUT /api/tickets/:id  (update: status, assignment, comment, etc.)
router.put("/:id", (req, res) => {
  const idx = tickets.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  const existing = tickets[idx];
  const body = req.body || {};
  const updatedBy = body.updatedBy || "Unknown";

  const officeId = body.officeId || existing.officeId;
  const officeName = officeLookup[officeId] || existing.officeName;

  const newStatus = body.status || existing.status;
  const newAssignedTo = body.assignedTo || existing.assignedTo;
  const statusChanged = newStatus !== existing.status;
  const assigneeChanged = newAssignedTo !== existing.assignedTo;

  const updated = {
    ...existing,
    title: body.title ?? existing.title,
    description: body.description ?? existing.description,
    priority: body.priority || existing.priority,
    status: newStatus,
    officeId,
    officeName,
    room: body.room ?? existing.room,
    type: body.type || existing.type,
    openedBy: body.openedBy || existing.openedBy,
    assignedTo: newAssignedTo,
  };

  const ts = stamp();
  const history = Array.isArray(existing.history) ? existing.history.slice() : [];

  const comment = body.comment || "";

  if (statusChanged) {
    let action = `Status changed to ${newStatus}`;
    if (newStatus === "Closed") {
      action = "Ticket closed";
    }
    history.push({
      timestamp: ts,
      action,
      user: updatedBy,
      comment,
    });
  } else if (assigneeChanged) {
    history.push({
      timestamp: ts,
      action: `Ticket routed to ${newAssignedTo}`,
      user: updatedBy,
      comment,
    });
  } else if (comment) {
    history.push({
      timestamp: ts,
      action: "Progress update",
      user: updatedBy,
      comment,
    });
  }

  updated.history = history;
  tickets[idx] = updated;
  res.json(updated);
});

// POST /api/tickets/:id/comments  (comment only, no field changes)
router.post("/:id/comments", (req, res) => {
  const idx = tickets.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  const body = req.body || {};
  const comment = body.comment || "";
  const user = body.user || "Unknown";

  if (!comment.trim()) {
    return res.status(400).json({ message: "Comment is required" });
  }

  const ticket = tickets[idx];
  const history = Array.isArray(ticket.history) ? ticket.history.slice() : [];

  history.push({
    timestamp: stamp(),
    action: "Progress update",
    user,
    comment,
  });

  const updated = { ...ticket, history };
  tickets[idx] = updated;

  res.json(updated);
});

export default router;
