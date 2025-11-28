import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import "./ClinicalRoomsPage.css";

const INITIAL_ROOMS = [
  {
    id: "OP-1",
    office: "Campbell Dental & Orthodontics",
    patientName: "Juan Martinez",
    provider: "Dr. G. Ghannam",
    assistant: "Ashley",
    hygienist: null,
    status: "In treatment",
    tvStatus: "Netflix",
    notes: "MO composite #30",
    lastEvent: "Provider entered room",
    lastUpdated: "2025-11-27 09:12",
  },
  {
    id: "OP-2",
    office: "Campbell Dental & Orthodontics",
    patientName: "Leila Hassan",
    provider: null,
    assistant: "Brittany",
    hygienist: "Sara RDH",
    status: "Waiting on provider",
    tvStatus: "Tubi",
    notes: "Prophy + exam",
    lastEvent: "Hygiene completed, waiting for doctor check",
    lastUpdated: "2025-11-27 09:05",
  },
  {
    id: "OP-3",
    office: "Campbell Dental & Orthodontics",
    patientName: "—",
    provider: null,
    assistant: null,
    hygienist: null,
    status: "Cleaning in progress",
    tvStatus: "Off",
    notes: "Turnover: used for extractions",
    lastEvent: "Assistant started room cleaning",
    lastUpdated: "2025-11-27 08:58",
  },
  {
    id: "OP-4",
    office: "Vernor Dental Care",
    patientName: "Emily Rogers",
    provider: "Dr. Patel",
    assistant: "Chris",
    hygienist: null,
    status: "Ready for patient",
    tvStatus: "Welcome screen",
    notes: "Emergency block",
    lastEvent: "Room prepped, instruments ready",
    lastUpdated: "2025-11-27 09:20",
  },
  {
    id: "OP-5",
    office: "Allenwood Dental - Woodhaven",
    patientName: "—",
    provider: null,
    assistant: null,
    hygienist: null,
    status: "Empty",
    tvStatus: "Off",
    notes: "Available",
    lastEvent: "No recent activity",
    lastUpdated: "2025-11-27 08:30",
  },
  {
    id: "OP-6",
    office: "Allenwood Dental - Woodhaven",
    patientName: "David Nguyen",
    provider: "Dr. Kim",
    assistant: "Laura",
    hygienist: null,
    status: "In treatment",
    tvStatus: "Disney+",
    notes: "Crown seat #14",
    lastEvent: "Assistant seated patient",
    lastUpdated: "2025-11-27 09:02",
  },
];

const STATUS_OPTIONS = [
  "All statuses",
  "In treatment",
  "Waiting on provider",
  "Ready for patient",
  "Cleaning in progress",
  "Empty",
];

function statusPillClass(status) {
  switch (status) {
    case "In treatment":
      return "rooms-pill rooms-pill--blue";
    case "Waiting on provider":
      return "rooms-pill rooms-pill--amber";
    case "Ready for patient":
      return "rooms-pill rooms-pill--green";
    case "Cleaning in progress":
      return "rooms-pill rooms-pill--purple";
    case "Empty":
      return "rooms-pill rooms-pill--gray";
    default:
      return "rooms-pill";
  }
}

export default function ClinicalRoomsPage() {
  const { currentOffice } = useApp();
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [search, setSearch] = useState("");

  const filteredRooms = useMemo(() => {
    const officeToApply =
      currentOffice && currentOffice !== "All offices" ? currentOffice : null;

    return rooms.filter((room) => {
      const matchOffice = !officeToApply || room.office === officeToApply;
      const matchStatus =
        statusFilter === "All statuses" || room.status === statusFilter;
      const lower = search.toLowerCase();
      const matchSearch =
        !lower ||
        room.id.toLowerCase().includes(lower) ||
        (room.patientName &&
          room.patientName.toLowerCase().includes(lower)) ||
        (room.provider && room.provider.toLowerCase().includes(lower));
      return matchOffice && matchStatus && matchSearch;
    });
  }, [rooms, currentOffice, statusFilter, search]);

  const inUseCount = rooms.filter((r) =>
    ["In treatment", "Waiting on provider"].includes(r.status)
  ).length;

  const readyCount = rooms.filter((r) => r.status === "Ready for patient")
    .length;

  const cleaningCount = rooms.filter((r) => r.status === "Cleaning in progress")
    .length;

  const emptyCount = rooms.filter((r) => r.status === "Empty").length;

  function updateRoom(id, updates, eventLabel) {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setRooms((prev) =>
      prev.map((room) =>
        room.id === id
          ? {
              ...room,
              ...updates,
              lastEvent: eventLabel || room.lastEvent,
              lastUpdated: timestamp,
            }
          : room
      )
    );
  }

  return (
    <div className="rooms-page">
      <div className="rooms-header-row">
        <div>
          <h1 className="rooms-title">Clinical Rooms</h1>
          <p className="rooms-subtitle">
            Live view of who is in each room, what they are doing, and room
            status across locations.
          </p>
          {currentOffice && currentOffice !== "All offices" && (
            <p className="rooms-subtitle">
              Showing rooms for: <strong>{currentOffice}</strong>
            </p>
          )}
        </div>
        <div className="rooms-header-actions">
          <button className="rooms-button rooms-button--secondary">
            Room settings
          </button>
          <button className="rooms-button rooms-button--primary">
            TV presets
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="rooms-summary-row">
        <div className="rooms-summary-card rooms-summary-card--blue">
          <div className="rooms-summary-label">Rooms in use</div>
          <div className="rooms-summary-value">{inUseCount}</div>
          <div className="rooms-summary-foot">
            In treatment or waiting on provider
          </div>
        </div>
        <div className="rooms-summary-card rooms-summary-card--green">
          <div className="rooms-summary-label">Ready for patient</div>
          <div className="rooms-summary-value">{readyCount}</div>
          <div className="rooms-summary-foot">
            Turned over and ready to seat
          </div>
        </div>
        <div className="rooms-summary-card rooms-summary-card--purple">
          <div className="rooms-summary-label">Cleaning in progress</div>
          <div className="rooms-summary-value">{cleaningCount}</div>
          <div className="rooms-summary-foot">
            Rooms being turned over now
          </div>
        </div>
        <div className="rooms-summary-card rooms-summary-card--gray">
          <div className="rooms-summary-label">Empty</div>
          <div className="rooms-summary-value">{emptyCount}</div>
          <div className="rooms-summary-foot">Available for scheduling</div>
        </div>
      </div>

      <div className="rooms-layout">
        <div className="rooms-main-card">
          {/* Filters (status + search only, office comes from header) */}
          <div className="rooms-filters-row">
            <div className="rooms-filter">
              <label className="rooms-filter-label">Status</label>
              <select
                className="rooms-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="rooms-filter rooms-filter--grow">
              <label className="rooms-filter-label">Search</label>
              <input
                className="rooms-filter-input"
                placeholder="Search by room, patient, or provider"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Board */}
          <div className="rooms-grid">
            {filteredRooms.map((room) => (
              <div key={room.id} className="rooms-tile">
                <div className="rooms-tile-header">
                  <div className="rooms-tile-room-id">{room.id}</div>
                  <span className={statusPillClass(room.status)}>
                    {room.status}
                  </span>
                </div>

                <div className="rooms-tile-body">
                  <div className="rooms-field">
                    <div className="rooms-field-label">Office</div>
                    <div className="rooms-field-value">{room.office}</div>
                  </div>

                  <div className="rooms-field">
                    <div className="rooms-field-label">Patient</div>
                    <div className="rooms-field-value">
                      {room.patientName || "—"}
                    </div>
                  </div>

                  <div className="rooms-two-col">
                    <div className="rooms-field">
                      <div className="rooms-field-label">Provider</div>
                      <div className="rooms-field-value">
                        {room.provider || "—"}
                      </div>
                    </div>
                    <div className="rooms-field">
                      <div className="rooms-field-label">Assistant / Hyg</div>
                      <div className="rooms-field-value">
                        {[room.assistant, room.hygienist]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="rooms-field">
                    <div className="rooms-field-label">Notes</div>
                    <div className="rooms-field-value rooms-notes">
                      {room.notes || "—"}
                    </div>
                  </div>

                  <div className="rooms-field">
                    <div className="rooms-field-label">TV / Comfort</div>
                    <select
                      className="rooms-tv-select"
                      value={room.tvStatus}
                      onChange={(e) =>
                        updateRoom(
                          room.id,
                          { tvStatus: e.target.value },
                          `TV changed to ${e.target.value}`
                        )
                      }
                    >
                      <option value="Off">Off</option>
                      <option value="Welcome screen">Welcome screen</option>
                      <option value="Netflix">Netflix</option>
                      <option value="Tubi">Tubi</option>
                      <option value="Disney+">Disney+</option>
                      <option value="Music only">Music only</option>
                    </select>
                  </div>
                </div>

                <div className="rooms-tile-footer">
                  <div className="rooms-footer-meta">
                    <div className="rooms-last-event">
                      {room.lastEvent || "No recent activity"}
                    </div>
                    <div className="rooms-last-updated">
                      Updated {room.lastUpdated}
                    </div>
                  </div>
                  <div className="rooms-footer-actions">
                    {room.status === "Cleaning in progress" && (
                      <button
                        className="rooms-small-button rooms-small-button--green"
                        onClick={() =>
                          updateRoom(
                            room.id,
                            { status: "Ready for patient" },
                            "Room cleaning completed"
                          )
                        }
                      >
                        Mark ready
                      </button>
                    )}
                    {room.status === "Ready for patient" && (
                      <button
                        className="rooms-small-button rooms-small-button--blue"
                        onClick={() =>
                          updateRoom(
                            room.id,
                            { status: "In treatment" },
                            "Patient seated / treatment started"
                          )
                        }
                      >
                        Start treatment
                      </button>
                    )}
                    {room.status === "In treatment" && (
                      <button
                        className="rooms-small-button rooms-small-button--purple"
                        onClick={() =>
                          updateRoom(
                            room.id,
                            {
                              status: "Cleaning in progress",
                              patientName: "—",
                              provider: null,
                              assistant: null,
                              hygienist: null,
                            },
                            "Assistant started room cleaning"
                          )
                        }
                      >
                        Start cleaning
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredRooms.length === 0 && (
              <div className="rooms-empty-state">
                No rooms match your filters.
              </div>
            )}
          </div>
        </div>

        {/* Side column: TV & presence summary */}
        <div className="rooms-side-column">
          <div className="rooms-side-card">
            <h2 className="rooms-side-title">TV / Comfort overview</h2>
            <ul className="rooms-side-list">
              <li>
                <span>Netflix</span>
                <strong>
                  {rooms.filter((r) => r.tvStatus === "Netflix").length}
                </strong>
              </li>
              <li>
                <span>Tubi</span>
                <strong>
                  {rooms.filter((r) => r.tvStatus === "Tubi").length}
                </strong>
              </li>
              <li>
                <span>Disney+</span>
                <strong>
                  {rooms.filter((r) => r.tvStatus === "Disney+").length}
                </strong>
              </li>
              <li>
                <span>Welcome screen</span>
                <strong>
                  {
                    rooms.filter(
                      (r) => r.tvStatus === "Welcome screen"
                    ).length
                  }
                </strong>
              </li>
              <li>
                <span>Off / Music only</span>
                <strong>
                  {
                    rooms.filter((r) =>
                      ["Off", "Music only"].includes(r.tvStatus)
                    ).length
                  }
                </strong>
              </li>
            </ul>
          </div>

          <div className="rooms-side-card">
            <h2 className="rooms-side-title">Who is in rooms now</h2>
            <p className="rooms-side-hint">
              (Future: this will be driven by NFC / badge scans)
            </p>
            <ul className="rooms-side-presence">
              {rooms
                .filter(
                  (r) =>
                    r.provider ||
                    r.assistant ||
                    r.hygienist
                )
                .map((room) => (
                  <li key={room.id}>
                    <div className="rooms-presence-line">
                      <div className="rooms-presence-room">{room.id}</div>
                      <div className="rooms-presence-names">
                        {[room.provider, room.assistant, room.hygienist]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
