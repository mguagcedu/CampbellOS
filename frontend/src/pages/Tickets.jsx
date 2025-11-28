import { useState } from "react";
import { useApp } from "../context/AppContext";

const statusLabels = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved"
};

const priorityColors = {
  high: "#dc2626",
  medium: "#f97316",
  low: "#16a34a"
};

export default function Tickets() {
  const { tickets, createTicket, updateTicketStatus } = useApp();
  const [form, setForm] = useState({
    area: "",
    category: "PC issue",
    description: "",
    priority: "medium",
    createdBy: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.area || !form.description || !form.createdBy) return;
    createTicket(form);
    setForm({
      area: "",
      category: "PC issue",
      description: "",
      priority: "medium",
      createdBy: ""
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tickets and fix it requests</h1>
        <p>
          Log IT, X-ray, chair, and facility problems so nothing is missed during
          the day.
        </p>
      </div>

      <section className="two-column">
        <div className="panel">
          <h2>New ticket</h2>
          <p className="panel-subline">
            Front desk, assistants, and hygienists can submit from any device.
          </p>
          <form className="ticket-form" onSubmit={handleSubmit}>
            <div className="ticket-row">
              <label>
                Area or room
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="Front desk PC, OP 2, Pan room"
                />
              </label>
            </div>
            <div className="ticket-row-grid">
              <label>
                Category
                <select name="category" value={form.category} onChange={handleChange}>
                  <option>PC issue</option>
                  <option>Software / OpenDental</option>
                  <option>X-ray</option>
                  <option>Chair / equipment</option>
                  <option>Phone / internet</option>
                  <option>Cleaning / facilities</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Priority
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>
            </div>
            <div className="ticket-row">
              <label>
                Brief description
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Example. X-ray sensor not recognized in OP 4, reboot did not help"
                />
              </label>
            </div>
            <div className="ticket-row">
              <label>
                Your name
                <input
                  name="createdBy"
                  value={form.createdBy}
                  onChange={handleChange}
                  placeholder="Who is reporting this"
                />
              </label>
            </div>
            <button type="submit" className="ticket-submit">
              Submit ticket
            </button>
          </form>
        </div>

        <div className="panel">
          <h2>Filters</h2>
          <p className="panel-subline">
            In the next step, managers will be able to filter by office, status,
            and vendor.
          </p>
          <ul className="bullet-list">
            <li>PC issue, X-ray, chair, facilities, phone</li>
            <li>See who opened the ticket and when</li>
            <li>Later, push out to IT, vendors, or HVAC</li>
          </ul>
        </div>
      </section>

      <section className="panel ticket-list-panel">
        <h2>Ticket queue</h2>
        <p className="panel-subline">
          Quick snapshot of all open problems in the building.
        </p>
        <div className="ticket-list">
          {tickets.map((t) => (
            <TicketRow
              key={t.id}
              ticket={t}
              onStatusChange={updateTicketStatus}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function TicketRow({ ticket, onStatusChange }) {
  const color = priorityColors[ticket.priority] || "#6b7280";

  return (
    <div className="ticket-row-card">
      <div className="ticket-main">
        <div className="ticket-id">{ticket.id}</div>
        <div className="ticket-title">
          <span className="ticket-area">{ticket.area}</span>
          <span className="ticket-category">· {ticket.category}</span>
        </div>
        <div className="ticket-description">{ticket.description}</div>
        <div className="ticket-meta">
          <span>Opened by {ticket.createdBy}</span>
          <span> · {ticket.createdAt}</span>
          <span> · Assigned to {ticket.assignedTo}</span>
        </div>
      </div>
      <div className="ticket-side">
        <span
          className="ticket-priority"
          style={{ borderColor: color, color }}
        >
          {ticket.priority.toUpperCase()}
        </span>
        <select
          className="ticket-status-select"
          value={ticket.status}
          onChange={(e) => onStatusChange(ticket.id, e.target.value)}
        >
          <option value="open">{statusLabels.open}</option>
          <option value="in_progress">{statusLabels.in_progress}</option>
          <option value="resolved">{statusLabels.resolved}</option>
        </select>
      </div>
    </div>
  );
}
