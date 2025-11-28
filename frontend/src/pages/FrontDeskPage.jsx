import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import "./FrontDeskPage.css";

const demoSchedules = {
  "Campbell Dental": [
    {
      time: "9:00 AM",
      patient: "Maria G.",
      reason: "New patient exam",
      badge: "New",
      status: "Arrived",
    },
    {
      time: "9:30 AM",
      patient: "James P.",
      reason: "Emergency – toothache",
      badge: "Emergency",
      status: "On the way",
    },
    {
      time: "10:15 AM",
      patient: "Leah C.",
      reason: "6-month recall cleaning",
      badge: "Recall",
      status: "Confirmed",
    },
  ],
  "Vernor Dental": [
    {
      time: "8:45 AM",
      patient: "Oscar R.",
      reason: "Fillings – upper left",
      badge: "Tx",
      status: "Seated",
    },
    {
      time: "9:20 AM",
      patient: "Nadia S.",
      reason: "Consult – ortho",
      badge: "Consult",
      status: "Checked in",
    },
  ],
  "Allenwood Dental": [
    {
      time: "9:10 AM",
      patient: "Brian T.",
      reason: "Crown seat – #30",
      badge: "Seat",
      status: "In lobby",
    },
    {
      time: "10:00 AM",
      patient: "Chloe A.",
      reason: "New patient exam & cleaning",
      badge: "New",
      status: "Confirmed",
    },
  ],
};

export default function FrontDeskPage() {
  const { currentOffice } = useApp();

  const schedule = useMemo(() => {
    if (!currentOffice) return demoSchedules["Campbell Dental"];
    return demoSchedules[currentOffice.name] || demoSchedules["Campbell Dental"];
  }, [currentOffice]);

  return (
    <div className="frontdesk-page">
      <header className="frontdesk-header">
        <h1>Front Desk &amp; Schedule</h1>
        <p>
          Today&apos;s schedule, calls, and walk-ins for{" "}
          <span className="frontdesk-office-name">
            {currentOffice?.name || "Campbell Dental"}
          </span>
          .
        </p>
      </header>

      <div className="frontdesk-card">
        <div className="frontdesk-card-header">
          <div>
            <h2>Today&apos;s patients</h2>
            <span className="frontdesk-subtitle">
              Snapshot of arrivals, emergencies, and walk-ins.
            </span>
          </div>
          <button
            type="button"
            className="frontdesk-btn frontdesk-btn-primary"
          >
            + Add walk-in
          </button>
        </div>

        <div className="frontdesk-table-wrapper">
          <table className="frontdesk-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, idx) => (
                <tr key={idx}>
                  <td className="frontdesk-time">{row.time}</td>
                  <td className="frontdesk-patient">{row.patient}</td>
                  <td className="frontdesk-reason">
                    {row.badge && (
                      <span className="frontdesk-pill">{row.badge}</span>
                    )}
                    <span>{row.reason}</span>
                  </td>
                  <td className="frontdesk-status">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="frontdesk-footer">
          <span className="dot dot-new" /> New patient
          <span className="dot dot-emergency" /> Emergency / same-day
          <span className="dot dot-recall" /> Recall / hygiene
        </footer>
      </div>
    </div>
  );
}
