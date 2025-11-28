import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export default function TicketDetailModal({
  ticket,
  statuses,
  onClose,
  onUpdated,
}) {
  const { user } = useAuth();

  const [status, setStatus] = useState(ticket.status || "New");
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || "");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveUpdate(withFields = true) {
    try {
      setSaving(true);
      setError("");

      const payload = {
        updatedBy: user?.name || user?.email || "Unknown",
        comment,
      };

      if (withFields) {
        payload.status = status;
        payload.assignedTo = assignedTo;
      }

      const res = await fetch(`${API_BASE}/api/tickets/${ticket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update ticket");
      const updated = await res.json();
      onUpdated(updated);
      setComment("");
    } catch (err) {
      console.error(err);
      setError("Unable to save update");
    } finally {
      setSaving(false);
    }
  }

  async function addCommentOnly() {
    if (!comment.trim()) {
      setError("Please enter a comment before adding an update.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/tickets/${ticket.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user?.name || user?.email || "Unknown",
          comment,
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");
      const updated = await res.json();
      onUpdated(updated);
      setComment("");
    } catch (err) {
      console.error(err);
      setError("Unable to add comment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ticket-modal-backdrop">
      <div className="ticket-modal">
        <header className="ticket-modal-header">
          <div>
            <h2>
              {ticket.id} – {ticket.title}
            </h2>
            <p>
              {ticket.officeName} • Room: {ticket.room || "N/A"} • Opened by{" "}
              {ticket.openedBy} on {ticket.time}
            </p>
          </div>
          <button type="button" className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </header>

        {error && <div className="ticket-modal-error">{error}</div>}

        <div className="ticket-modal-body">
          <section className="ticket-modal-left">
            <h3>Details</h3>
            <p className="ticket-modal-description">
              {ticket.description || "No description provided."}
            </p>

            <div className="ticket-modal-fields">
              <label>
                Status
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Assigned to
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="IT Queue, Facilities, Vendor, etc."
                />
              </label>
            </div>

            <label className="ticket-modal-comment">
              Progress comment
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="What did you do, what is the next step, or what do you need from the next person?"
              />
            </label>

            <div className="ticket-modal-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => saveUpdate(true)}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save status / routing + comment"}
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={addCommentOnly}
                disabled={saving}
              >
                {saving ? "Saving…" : "Add comment only"}
              </button>
              {status !== "Closed" && (
                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => setStatus("Closed")}
                  disabled={saving}
                >
                  Mark as closed (then Save)
                </button>
              )}
            </div>
          </section>

          <section className="ticket-modal-right">
            <h3>History</h3>
            {Array.isArray(ticket.history) && ticket.history.length > 0 ? (
              <ul className="ticket-history-list">
                {ticket.history.map((h, idx) => (
                  <li key={idx} className="ticket-history-item">
                    <div className="ticket-history-meta">
                      <span className="ticket-history-time">
                        {h.timestamp}
                      </span>
                      <span className="ticket-history-user">{h.user}</span>
                    </div>
                    <div className="ticket-history-action">{h.action}</div>
                    {h.comment && (
                      <div className="ticket-history-comment">
                        {h.comment}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ticket-history-empty">No history yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
