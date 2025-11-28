import StatCard from "../components/StatCard";
import "./pages.css";

export default function Dashboard() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Operations overview</h1>
        <p>
          Live snapshot of rooms, patients, and staff metrics across the office.
        </p>
      </div>

      <section className="grid-3">
        <StatCard
          label="Patients in office"
          value="18"
          sublabel="5 in waiting room, 13 in operatories"
        />
        <StatCard
          label="Rooms ready"
          value="3"
          sublabel="Cleaning team on track"
        />
        <StatCard
          label="Calls today"
          value="142"
          sublabel="Front desk, hygiene, ortho"
        />
      </section>

      <section className="two-column">
        <div className="panel">
          <h2>Today at Campbell Dental</h2>
          <ul className="bullet-list">
            <li>Dr schedule fully booked 9 to 5</li>
            <li>Two hygienists floating between locations</li>
            <li>Smart TVs streaming in 7 rooms</li>
            <li>3 open tickets with IT and facilities</li>
          </ul>
        </div>

        <div className="panel">
          <h2>Quick actions</h2>
          <div className="quick-actions">
            <button>Room status board</button>
            <button>Staff presence</button>
            <button>Open a ticket</button>
            <button>HR & licensing</button>
          </div>
        </div>
      </section>
    </div>
  );
}
