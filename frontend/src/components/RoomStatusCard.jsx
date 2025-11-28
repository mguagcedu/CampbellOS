import { useApp } from "../context/AppContext";

const statusConfig = {
  in_use: { label: "In use", color: "#ef4444" },
  cleaning: { label: "Cleaning", color: "#f97316" },
  ready: { label: "Ready", color: "#22c55e" }
};

export default function RoomStatusCard({ room }) {
  const { updateRoomStatus } = useApp();
  const cfg = statusConfig[room.status] || statusConfig.ready;

  function setStatus(status) {
    updateRoomStatus(room.id, { status, lastUpdated: "Just now" });
  }

  return (
    <div className="room-card">
      <div className="room-card-header">
        <div>
          <div className="room-name">{room.name}</div>
          <div className="room-id">{room.id}</div>
        </div>
        <div
          className="room-status-pill"
          style={{ backgroundColor: cfg.color + "22", color: cfg.color }}
        >
          {cfg.label}
        </div>
      </div>

      <div className="room-body">
        <div className="room-row">
          <span className="room-label">Patient</span>
          <span className="room-value">
            {room.patientName || "None assigned"}
          </span>
        </div>
        <div className="room-row">
          <span className="room-label">Provider</span>
          <span className="room-value">{room.provider || "TBD"}</span>
        </div>
        <div className="room-row">
          <span className="room-label">Assistant</span>
          <span className="room-value">{room.assistant || "TBD"}</span>
        </div>
        <div className="room-row">
          <span className="room-label">Last update</span>
          <span className="room-value">{room.lastUpdated}</span>
        </div>
      </div>

      <div className="room-actions">
        <button onClick={() => setStatus("in_use")}>In use</button>
        <button onClick={() => setStatus("cleaning")}>Cleaning</button>
        <button onClick={() => setStatus("ready")}>Ready</button>
      </div>
    </div>
  );
}
