import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import TicketDetailModal from "../components/TicketDetailModal.jsx";
import "./TicketingPage.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const TYPES = ["IT", "Clinical", "Maintenance", "Phone", "Other"];
const STATUSES = ["New", "Assigned", "In progress", "Closed"];

export default function TicketingPage() {
  const { selectedOffice } = useApp();
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newType, setNewType] = useState("IT");
  const [newRoom, setNewRoom] = useState("");
  const [newAssignedTo, setNewAssignedTo] = useState("IT Queue");

  const officeId = selectedOffice || "campbell";

  async function loadTickets() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `${API_BASE}/api/tickets?officeId=${encodeURIComponent(officeId)}`
      );
      if (!res.ok) throw new Error("Failed to load tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [officeId]);

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === "Active") {
      return t.status !== "Closed";
    }
    if (statusFilter === "Closed") {
      return t.status === "Closed";
    }
    return true; // All
  });

  async function handleCreateTicket(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          priority: newPriority,
          type: newType,
          room: newRoom,
          officeId,
          openedBy: user?.name || user?.email || "Unknown",
          assignedTo: newAssignedTo,
        }),
      });

      if (!res.ok) throw new Error("Failed to create ticket");
      const created = await res.json();
      setTickets((prev) => [created, ...prev]);

      // Clear form
      setNewTitle("");
      setNewDescription("");
      setNewPriority("Medium");
      setNewType("IT");
      setNewRoom("");
      setNewAssignedTo("IT Queue");
    } catch (err) {
      console.error(err);
      setError("Unable to create ticket");
    }
  }

  function handleTicketUpdated(updated) {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setSelectedTicket(updated);
  }

  return (
    <div className="ticketing-page">
      <header className="ticketing-header">
        <div>
          <h1>IT & Facilities Ticketing</h1>
          <p>
            Log issues, route them to the right person, and track progress from
            creation to completion.
          </p>
        </div>
        <div className="ticketing-filters">
          <label>
            Status view:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
              <option value="All">All</option>
            </select>
          </label>
        </div>
      </header>

      {error && <div className="ticketing-error">{error}</div>}

      <div className="ticketing-layout">
        {/* Left: Ticket list */}
        <section className="ticketing-list-card">
          <div className="ticketing-list-header">
            <h2>Tickets</h2>
            <button type="button" onClick={loadTickets}>
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="ticketing-loading">Loading tickets…</div>
          ) : filteredTickets.length === 0 ? (
            <div className="ticketing-empty">
              No tickets for this office and filter.
            </div>
          ) : (
            <div className="ticketing-table-wrapper">
              <table className="ticketing-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Type</th>
                    <th>Room</th>
                    <th>Assigned to</th>
                    <th>Opened</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={
                        t.status === "Closed" ? "ticket-row-closed" : ""
                      }
                    >
                      <td>{t.id}</td>
                      <td>{t.title}</td>
                      <td>{t.status}</td>
                      <td>{t.priority}</td>
                      <td>{t.type}</td>
                      <td>{t.room}</td>
                      <td>{t.assignedTo || "Unassigned"}</td>
                      <td>{t.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Right: New ticket form */}
        <section className="ticketing-form-card">
          <h2>New ticket</h2>
          <form className="ticketing-form" onSubmit={handleCreateTicket}>
            <label>
              Title
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                placeholder="Short title of the issue"
              />
            </label>

            <label>
              Description / details
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={4}
                placeholder="Describe the problem, how often it happens, room, etc."
              />
            </label>

            <div className="ticketing-form-row">
              <label>
                Priority
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Type
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="ticketing-form-row">
              <label>
                Room / Area
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="OP-1, Front Desk, Sterilization, etc."
                />
              </label>

              <label>
                Route to
                <input
                  type="text"
                  value={newAssignedTo}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                  placeholder="IT Queue, Facilities, Vendor, etc."
                />
              </label>
            </div>

            <button type="submit" className="primary-btn">
              Create ticket
            </button>
          </form>
        </section>
      </div>

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          statuses={STATUSES}
          onClose={() => setSelectedTicket(null)}
          onUpdated={handleTicketUpdated}
        />
      )}
    </div>
  );
}
