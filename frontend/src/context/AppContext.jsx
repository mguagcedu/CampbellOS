import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AppContext = createContext(null);

const OFFICE_LIST = [
  {
    id: "campbell",
    name: "Campbell Dental & Orthodontics",
    shortName: "Campbell Dental",
    city: "Detroit",
  },
  {
    id: "vernor",
    name: "Vernor Dental Care",
    shortName: "Vernor Dental",
    city: "Detroit",
  },
  {
    id: "allenwood",
    name: "Allenwood Dental - Woodhaven",
    shortName: "Allenwood Dental",
    city: "Woodhaven",
  },
];

const INITIAL_TICKETS = [
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

const INITIAL_FRONT_DESK = [
  {
    id: 1,
    time: "9:00 AM",
    patient: "Maria G.",
    reason: "New patient exam",
    officeId: "campbell",
    status: "Arrived",
  },
  {
    id: 2,
    time: "9:30 AM",
    patient: "James P.",
    reason: "Emergency – toothache",
    officeId: "campbell",
    status: "On the way",
  },
  {
    id: 3,
    time: "10:00 AM",
    patient: "Carlos R.",
    reason: "Recall cleaning",
    officeId: "vernor",
    status: "Confirmed",
  },
];

const INITIAL_ROOMS = [
  {
    id: "OP-1",
    officeId: "campbell",
    provider: "Dr. Ghannam",
    patient: "Maria G.",
    status: "In chair",
    xraysToday: 4,
  },
  {
    id: "OP-2",
    officeId: "campbell",
    provider: "Dr. K.",
    patient: "—",
    status: "Ready",
    xraysToday: 0,
  },
  {
    id: "OP-3",
    officeId: "campbell",
    provider: "Hygiene – Jessica",
    patient: "James P.",
    status: "X-rays",
    xraysToday: 8,
  },
  {
    id: "OP-4",
    officeId: "vernor",
    provider: "Dr. S.",
    patient: "Carlos R.",
    status: "In chair",
    xraysToday: 2,
  },
];

const INITIAL_HR = [
  {
    id: 1,
    name: "Carolina",
    role: "Admin / Office Manager",
    officeId: "campbell",
    licenseType: "RDA",
    licenseExpires: "2026-03-15",
    trainingsDue: "HIPAA refresher by 12/31",
  },
  {
    id: 2,
    name: "Manny",
    role: "Operations / IT",
    officeId: "all",
    licenseType: "N/A",
    licenseExpires: "",
    trainingsDue: "ADP reporting – complete",
  },
  {
    id: 3,
    name: "Jessica",
    role: "RDH",
    officeId: "campbell",
    licenseType: "RDH",
    licenseExpires: "2025-09-01",
    trainingsDue: "Radiation safety – complete",
  },
];

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5001";

export function AppProvider({ children }) {
  const [selectedOfficeId, setSelectedOfficeId] = useState("campbell");
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [frontDesk, setFrontDesk] = useState(INITIAL_FRONT_DESK);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [hrRecords, setHrRecords] = useState(INITIAL_HR);

  // Load tickets from backend on first load
  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await fetch(`${API_BASE}/api/tickets`);
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Failed to load tickets from API, using demo data.", err);
      }
    }

    loadTickets();
  }, []);

  const value = {
    offices: OFFICE_LIST,
    selectedOfficeId,
    setSelectedOfficeId,
    tickets,
    setTickets,
    frontDesk,
    setFrontDesk,
    rooms,
    setRooms,
    hrRecords,
    setHrRecords,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
