import { useApp } from "../context/AppContext.jsx";
import "./RoomsPage.css";

export default function RoomsPage() {
  const { rooms, selectedOfficeId, offices } = useApp();
  const office = offices.find((o) => o.id === selectedOfficeId) || offices[0];

  const filtered = rooms.filter(
    (r) => r.officeId === selectedOfficeId || selectedOfficeId === "all"
  );

  return (
    <div className="rooms-page">
      <h1>Rooms &amp; Presence</h1>
      <p className="rooms-subtitle">
        Live view of operatories and chair status for {office.shortName}.
      </p>

      <div className="rooms-grid">
        {filtered.map((room) => (
          <div className="room-card" key={room.id}>
            <div className="room-header">
              <span className="room-name">{room.id}</span>
              <span
                className={
                  "room-status-badge room-status-" +
                  room.status.toLowerCase().replace(/\s+/g, "-")
                }
              >
                {room.status}
              </span>
            </div>
            <div className="room-line">
              <span className="label">Provider</span>
              <span>{room.provider}</span>
            </div>
            <div className="room-line">
              <span className="label">Patient</span>
              <span>{room.patient}</span>
            </div>
            <div className="room-line">
              <span className="label">X-rays today</span>
              <span>{room.xraysToday}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
