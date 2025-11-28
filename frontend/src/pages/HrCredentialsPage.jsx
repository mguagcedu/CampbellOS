const mockEmployees = [
  {
    id: 1,
    name: "Carolina G.",
    role: "Clinical Office Administrator",
    officeCode: "CDO",
    officeName: "Campbell Dental & Orthodontics",
    licenses: [
      { type: "CPR/BLS", status: "Active", expires: "2026-03-15" },
      { type: "HIPAA Training", status: "Active", expires: "2025-12-01" },
    ],
  },
  {
    id: 2,
    name: "Dr. G. Ghannam",
    role: "Dentist",
    officeCode: "CDO",
    officeName: "Campbell Dental & Orthodontics",
    licenses: [
      { type: "MI Dental License", status: "Active", expires: "2027-07-31" },
      { type: "DEA Registration", status: "Active", expires: "2026-01-10" },
    ],
  },
  {
    id: 3,
    name: "Paula H.",
    role: "Hygienist",
    officeCode: "ADW",
    officeName: "Allenwood Dental - Woodhaven",
    licenses: [
      { type: "MI Hygiene License", status: "Expiring soon", expires: "2025-02-20" },
      { type: "CPR/BLS", status: "Active", expires: "2026-04-05" },
    ],
  },
  {
    id: 4,
    name: "Omar R.",
    role: "RDA",
    officeCode: "VDC",
    officeName: "Vernor Dental Care",
    licenses: [
      { type: "RDA", status: "Expired", expires: "2024-10-01" },
      { type: "Radiology Certification", status: "Active", expires: "2026-06-30" },
    ],
  },
];

export default function HrCredentialsPage() {
  return (
    <div className="hr-page">
      <header className="hr-header">
        <div>
          <h2>HR &amp; Credentials</h2>
          <p>
            Central place to track licenses, certifications, and training status
            across Campbell Dental &amp; Orthodontics, Vernor Dental Care, and
            Allenwood Dental - Woodhaven.
          </p>
        </div>
        <div className="hr-header-badges">
          <span className="hr-pill hr-pill-ok">Active</span>
          <span className="hr-pill hr-pill-warning">Expiring soon</span>
          <span className="hr-pill hr-pill-danger">Expired</span>
        </div>
      </header>

      <section className="hr-table-section">
        <div className="hr-table-header-row">
          <div>Team member</div>
          <div>Role</div>
          <div>Office</div>
          <div>Credential</div>
          <div>Status</div>
          <div>Expires</div>
        </div>

        {mockEmployees.map((emp) =>
          emp.licenses.map((lic, idx) => (
            <div className="hr-table-row" key={`${emp.id}-${idx}`}>
              <div>{emp.name}</div>
              <div>{emp.role}</div>
              <div>
                {emp.officeCode} · {emp.officeName}
              </div>
              <div>{lic.type}</div>
              <div>
                <span className={`hr-status-badge ${statusClass(lic.status)}`}>
                  {lic.status}
                </span>
              </div>
              <div>{formatDate(lic.expires)}</div>
            </div>
          ))
        )}
      </section>

      <section className="hr-links">
        <h3>Quick links</h3>
        <ul>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Open ADP employee profile (future integration)
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()}>
              View license renewal instructions (per role)
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Export credential report for audits
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

function statusClass(status) {
  const s = status.toLowerCase();
  if (s.includes("expired")) return "hr-status-danger";
  if (s.includes("expiring")) return "hr-status-warning";
  return "hr-status-ok";
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
