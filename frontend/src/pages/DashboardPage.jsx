import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import "./DashboardPage.css";

export default function DashboardPage() {
  const app = useApp();
  const currentUser = app?.currentUser || {};
  const firstName = currentUser.firstName || currentUser.name || "Carolina";

  const officeLabel =
    app?.currentOfficeLabel ||
    app?.selectedOfficeLabel ||
    "Campbell Dental · Detroit";

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-office">{officeLabel}</div>
        <div className="dashboard-subtitle">
          Live view of schedule, rooms, HR, and IT tickets for this office.
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <h1>Welcome back, {firstName}.</h1>
          <p>
            This is your one-stop hub for Campbell Dental: schedules, rooms,
            metrics, HR, and IT.
          </p>
        </section>

        <section className="dashboard-grid">
          <Link to="/frontdesk" className="dashboard-card">
            <h2>Front Desk &amp; Call Center</h2>
            <p>
              Today&apos;s schedule, calls, new patients, cancellations, and
              no-shows at a glance.
            </p>
          </Link>

          <Link to="/rooms" className="dashboard-card">
            <h2>Clinical &amp; Rooms</h2>
            <p>
              Operatory status, who is in each room, x-rays taken, and chair
              utilization.
            </p>
          </Link>

          <Link to="/hr" className="dashboard-card">
            <h2>HR, Credentials &amp; ADP</h2>
            <p>
              Licenses, renewals, trainings, bonuses, and quick links to ADP
              payroll and timecards.
            </p>
          </Link>

          <Link to="/tickets" className="dashboard-card">
            <h2>IT &amp; Ticketing</h2>
            <p>
              Broken chairs, PCs, sensors, and other issues routed directly to
              the operations / IT lead.
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
}
