import express from "express";

const router = express.Router();

// Demo in-memory tickets
let tickets = [
  {
    id: "T-1001",
    priority: "High",
    status: "Open",
    officeId: "campbell",
    title: "X-ray sensor not detecting in OP-3",
    room: "OP-3",
    type: "Clinical",
    openedBy: "Jessica (RDH)",
    time: "9:12 AM",
    description:
      "Sensor intermittently not recognized by imaging PC. Tried restarting twice.",
  },
  {
    id: "T-1002",
    priority: "Medium",
    status: "In progress",
    officeId: "vernor",
    title: "Front desk computer restarting randomly",
    room: "Front Desk",
    type: "IT",
    openedBy: "Lorena (FD)",
    time: "10:01 AM",
    description:
      "PC reboots 3–4 times per day while scheduling appointments.",
  },
  {
    id: "T-1003",
    priority: "Low",
    status: "Open",
    officeId: "allenwood",
    title: "Chair pedal not responding",
    room: "OP-2",
    type: "Maintenance",
    openedBy: "David (DA)",
    time: "8:45 AM",
    description:
      "Foot control sometimes fails to recline chair. Works after power cycle.",
  },
];

// GET /api/tickets?officeId=campbell|vernor|allenwood|all
router.get("/", (req, res) => {
  const officeId = req.query.officeId;
  let data = tickets;
  if (officeId && officeId !== "all") {
    data = tickets.filter((t) => t.officeId === officeId);
  }
  res.json(data);
});

// GET /api/tickets/:id
router.get("/:id", (req, res) => {
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }
  res.json(ticket);
});

// POST /api/tickets  (create)
router.post("/", (req, res) => {
  const now = new Date();
  const autoTime = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const {
    priority = "Medium",
    status = "Open",
    officeId = "campbell",
    title = "New ticket",
    room = "Front Desk",
    type = "IT",
    openedBy = "Unknown",
    time,
    description = "",
  } = req.body || {};

  const newTicket = {
    id: "T-" + (tickets.length + 1001),
    priority,
    status,
    officeId,
    title,
    room,
    type,
    openedBy,
    time: time || autoTime,
    description,
  };

  tickets = [newTicket, ...tickets];
  res.status(201).json(newTicket);
});

// PUT /api/tickets/:id  (update)
router.put("/:id", (req, res) => {
  const index = tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  const existing = tickets[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // lock ID
  };

  tickets[index] = updated;
  res.json(updated);
});

export default router;
