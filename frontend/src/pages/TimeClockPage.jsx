import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "./HrPage.css";

// Demo employee list for admin time clock view.
// Later this should be replaced with real employees from the HR backend.
const DEMO_EMPLOYEES = [
  {
    id: "emp-carolina",
    name: "Carolina Gomez",
    role: "Admin / Ops",
    adpId: "A100001",
  },
  {
    id: "emp-emi",
    name: "Emiliano Gomez",
    role: "Dental Assistant",
    adpId: "A100002",
  },
  {
    id: "emp-manny",
    name: "Manny Gomez",
    role: "Hygiene Assistant",
    adpId: "A100003",
  },
  {
    id: "emp-lead-rda",
    name: "Lead RDA",
    role: "Registered Dental Assistant",
    adpId: "A200010",
  },
];

export default function TimeClockPage() {
  const { user } = useAuth();

  const userName = user?.name || "Staff member";
  const userRole = user?.role || "staff";

  // Treat these roles as "admin-like" for time & attendance
  const isAdminLike = useMemo(
    () =>
      ["admin", "office-admin", "manager", "owner"].includes(
        String(userRole).toLowerCase()
      ),
    [userRole]
  );

  const [adpId, setAdpId] = useState("");
  const [displayName, setDisplayName] = useState(userName);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    isAdminLike ? DEMO_EMPLOYEES[0]?.id : null
  );

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

  const filteredEmployees = useMemo(() => {
    if (!isAdminLike) return [];
    if (!searchTerm.trim()) return DEMO_EMPLOYEES;

    const term = searchTerm.toLowerCase();
    return DEMO_EMPLOYEES.filter((emp) => {
      return (
        emp.name.toLowerCase().includes(term) ||
        emp.role.toLowerCase().includes(term) ||
        (emp.adpId && emp.adpId.toLowerCase().includes(term))
      );
    });
  }, [isAdminLike, searchTerm]);

  const selectedEmployee = useMemo(() => {
    if (!isAdminLike) return null;
    return (
      DEMO_EMPLOYEES.find((emp) => emp.id === selectedEmployeeId) ||
      DEMO_EMPLOYEES[0] ||
      null
    );
  }, [isAdminLike, selectedEmployeeId]);

  // When admin selects a new employee, sync displayName/adpId
  useEffect(() => {
    if (!isAdminLike || !selectedEmployee) return;
    setDisplayName(selectedEmployee.name);
    setAdpId(selectedEmployee.adpId || "");
  }, [isAdminLike, selectedEmployee]);

  async function sendEvent(eventType) {
    if (!adpId) {
      alert("Enter the ADP ID first.");
      return;
    }

    setIsSending(true);
    setStatusMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/adp-demo/clock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeAdpId: adpId,
          employeeName: displayName || userName,
          eventType,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to record event");
      }

      const data = await res.json();
      const ts = data.event?.timestamp || new Date().toISOString();
      const timeStr = new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const label = eventType
        .replace("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

      setStatusMessage(
        `${label} recorded at ${timeStr} for ${
          displayName || userName
        }.`
      );
    } catch (err) {
      console.error("Error sending clock event", err);
      setStatusMessage("There was a problem recording this event.");
    } finally {
      setIsSending(false);
    }
  }

  function renderPunchButtons() {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 16,
        }}
      >
        <button
          type="button"
          disabled={isSending}
          onClick={() => sendEvent("CLOCK_IN")}
          className="btn-primary"
        >
          Clock in
        </button>
        <button
          type="button"
          disabled={isSending}
          onClick={() => sendEvent("LUNCH_START")}
          className="btn-secondary"
        >
          Lunch start
        </button>
        <button
          type="button"
          disabled={isSending}
          onClick={() => sendEvent("LUNCH_END")}
          className="btn-secondary"
        >
          Lunch end
        </button>
        <button
          type="button"
          disabled={isSending}
          onClick={() => sendEvent("CLOCK_OUT")}
          className="btn-secondary"
        >
          Clock out
        </button>
      </div>
    );
  }

  // --- NON-ADMIN VIEW: self-service time clock ---

  if (!isAdminLike) {
    return (
      <div className="hr-page">
        <div className="hr-header-row">
          <div>
            <div className="hr-breadcrumb">Time &amp; attendance</div>
            <h1 className="hr-title">Time clock</h1>
            <p className="hr-subtitle">
              Use this screen to punch in and out for your shift and lunch.
              Your events are queued for ADP integration in demo mode.
            </p>
          </div>
        </div>

        <div className="hr-layout">
          <div className="hr-team-card" style={{ marginBottom: 16 }}>
            <div className="hr-team-card-header">
              <div>
                <div className="hr-team-card-title">Your punch</div>
                <div className="hr-team-card-subtitle">
                  Clock events will be recorded under your name.
                </div>
              </div>
            </div>

            <div className="hr-grid" style={{ marginTop: 12 }}>
              <div className="hr-field">
                <label>Display name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Name shown on time clock"
                />
              </div>
              <div className="hr-field">
                <label>ADP ID</label>
                <input
                  type="text"
                  value={adpId}
                  onChange={(e) => setAdpId(e.target.value)}
                  placeholder="e.g., A123456"
                />
              </div>
            </div>

            <p className="hr-field-help" style={{ marginTop: 8 }}>
              In a live rollout, your ADP ID would come from HR automatically.
              For this demo, you can enter a test ID provided by the office
              manager.
            </p>

            {renderPunchButtons()}

            {statusMessage && (
              <p
                className="hr-field-help"
                style={{ marginTop: 10, color: "#16a34a" }}
              >
                {statusMessage}
              </p>
            )}
          </div>

          <div className="hr-team-card">
            <div className="hr-team-card-header">
              <div>
                <div className="hr-team-card-title">ADP demo queue</div>
                <div className="hr-team-card-subtitle">
                  Leadership can review these punches on the ADP demo screen.
                </div>
              </div>
            </div>
            <p className="hr-field-help" style={{ marginTop: 8 }}>
              Every punch you make here appears under{" "}
              <strong>Time &amp; attendance → ADP demo queue</strong>. That
              screen shows exactly what would be sent to ADP once API access is
              approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN VIEW: employee list + punch form ---

  return (
    <div className="hr-page">
      <div className="hr-header-row">
        <div>
          <div className="hr-breadcrumb">Time &amp; attendance</div>
          <h1 className="hr-title">Time clock – admin</h1>
          <p className="hr-subtitle">
            Admins can punch employees in or out for the day and lunch. This
            uses the same employee list and visual language as HR, tuned for
            timekeeping.
          </p>
        </div>
      </div>

      <div className="hr-layout">
        {/* Left: employee list / filter (HR-style) */}
        <div className="hr-team-card">
          <div className="hr-team-card-header">
            <div>
              <div className="hr-team-card-title">Employees</div>
              <div className="hr-team-card-subtitle">
                Search and select an employee to record a punch.
              </div>
            </div>
          </div>

          <div className="hr-filter-row">
            <input
              type="text"
              className="hr-filter-input"
              placeholder="Search by name, role, or ADP ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="hr-employee-list">
            {filteredEmployees.map((emp) => {
              const isSelected = emp.id === selectedEmployee?.id;
              return (
                <button
                  key={emp.id}
                  type="button"
                  className={`hr-employee-pill ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedEmployeeId(emp.id)}
                >
                  <div className="hr-employee-pill-main">
                    <span className="hr-employee-pill-name">{emp.name}</span>
                    <span className="hr-employee-pill-role">{emp.role}</span>
                  </div>
                  <div className="hr-employee-pill-meta">
                    ADP ID: {emp.adpId || "—"}
                  </div>
                </button>
              );
            })}

            {filteredEmployees.length === 0 && (
              <p className="hr-field-help" style={{ marginTop: 8 }}>
                No employees match this search. Clear the search field to see
                the full list.
              </p>
            )}
          </div>
        </div>

        {/* Right: punch card for selected employee */}
        <div className="hr-team-card">
          <div className="hr-team-card-header">
            <div>
              <div className="hr-team-card-title">
                Punch for{" "}
                {selectedEmployee?.name || displayName || "Selected employee"}
              </div>
              <div className="hr-team-card-subtitle">
                Clock events are recorded with this employee&apos;s display name
                and ADP ID.
              </div>
            </div>
          </div>

          <div className="hr-grid" style={{ marginTop: 12 }}>
            <div className="hr-field">
              <label>Display name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Employee name for ADP"
              />
            </div>
            <div className="hr-field">
              <label>ADP ID</label>
              <input
                type="text"
                value={adpId}
                onChange={(e) => setAdpId(e.target.value)}
                placeholder="ADP worker ID"
              />
            </div>
          </div>

          <p className="hr-field-help" style={{ marginTop: 8 }}>
            In a full integration, the ADP ID would be locked to the employee
            record and sourced directly from HR/ADP. For this proof of concept,
            IDs are editable test values.
          </p>

          {renderPunchButtons()}

          {statusMessage && (
            <p
              className="hr-field-help"
              style={{ marginTop: 10, color: "#16a34a" }}
            >
              {statusMessage}
            </p>
          )}

          <p className="hr-field-help" style={{ marginTop: 12 }}>
            All punches from this screen are visible under{" "}
            <strong>Time &amp; attendance → ADP demo queue</strong>, where
            operations leadership can review the event stream that would be
            transmitted to ADP.
          </p>
        </div>
      </div>
    </div>
  );
}
