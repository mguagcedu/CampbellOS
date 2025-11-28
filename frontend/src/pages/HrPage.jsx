import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import "./HrPage.css";

const DEFAULT_ROLES = [
  "Clinical Office Administrator",
  "Dentist",
  "Registered Dental Hygienist",
  "Dental Assistant",
  "Orthodontist",
  "Front Desk / Scheduling",
  "Billing Specialist",
  "Practice Manager",
];

const DEFAULT_LICENSE_TYPES = [
  "Admin – No clinical license",
  "Clinical – No license",
  "Dentist",
  "Registered Dental Hygienist",
  "Dental Assistant (RDA)",
  "Orthodontic assistant",
];

function generateBadgeId() {
  const ts = Date.now().toString().slice(-6);
  return `CB-${ts}`;
}

const INITIAL_EMPLOYEES = [
  {
    id: "emp-1",
    badgeId: "CB-100001",
    name: "Carolina Gomez",
    preferredName: "Carolina",
    role: "Registered Dental Hygienist",
    officeId: "campbell",
    officeName: "Campbell Dental & Orthodontics",
    licenseType: "Registered Dental Hygienist",
    licenseId: "N/A",
    expires: "",
    clinicallyLicensed: true,
    status: "Active",
    lastVerified: "2025-10-01",

    // Demographics
    dob: "",
    mobilePhone: "",
    personalEmail: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",

    // Certifications
    certCpr: false,
    certCprExpires: "",
    certXray: false,
    certXrayExpires: "",
    certOsha: false,
    certOshaExpires: "",
    otherCerts: "",

    // Pay / salary
    employmentStatus: "Full time",
    payType: "Hourly",
    payRate: "",
    payCurrency: "USD",
    ptoEligible: true,
    compNotes: "",
  },
  {
    id: "emp-2",
    badgeId: "CB-200001",
    name: "Dr. G. Ghannam",
    preferredName: "Dr. Ghannam",
    role: "Dentist",
    officeId: "campbell",
    officeName: "Campbell Dental & Orthodontics",
    licenseType: "Dentist",
    licenseId: "N/A",
    expires: "",
    clinicallyLicensed: true,
    status: "Active",
    lastVerified: "2025-09-18",

    dob: "",
    mobilePhone: "",
    personalEmail: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",

    certCpr: false,
    certCprExpires: "",
    certXray: false,
    certXrayExpires: "",
    certOsha: false,
    certOshaExpires: "",
    otherCerts: "",

    employmentStatus: "Full time",
    payType: "Salary",
    payRate: "",
    payCurrency: "USD",
    ptoEligible: true,
    compNotes: "",
  },
  {
    id: "emp-3",
    badgeId: "CB-300001",
    name: "Ashley",
    preferredName: "Ashley",
    role: "Dental Assistant",
    officeId: "campbell",
    officeName: "Campbell Dental & Orthodontics",
    licenseType: "Clinical – No license",
    licenseId: "",
    expires: "",
    clinicallyLicensed: false,
    status: "Active",
    lastVerified: "2025-09-30",

    dob: "",
    mobilePhone: "",
    personalEmail: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",

    certCpr: false,
    certCprExpires: "",
    certXray: false,
    certXrayExpires: "",
    certOsha: false,
    certOshaExpires: "",
    otherCerts: "",

    employmentStatus: "Full time",
    payType: "Hourly",
    payRate: "",
    payCurrency: "USD",
    ptoEligible: true,
    compNotes: "",
  },
];

function toTitleCase(value) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function inferClinicallyLicensed(licenseType) {
  if (!licenseType) return false;
  const lower = licenseType.toLowerCase();

  if (
    lower.includes("no clinical") ||
    lower.includes("no license") ||
    lower.includes("unlicensed")
  ) {
    return false;
  }

  if (lower.includes("admin") || lower.includes("front desk")) {
    return false;
  }

  return true;
}

export default function HrPage() {
  const app = useApp();
  const officesFromContext = app?.offices || [];

  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [licenseTypes, setLicenseTypes] = useState(DEFAULT_LICENSE_TYPES);

  const [search, setSearch] = useState("");
  const [officeFilter, setOfficeFilter] = useState("all");

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("employment");

  const [roleMode, setRoleMode] = useState("select");
  const [newRoleText, setNewRoleText] = useState("");
  const [licenseMode, setLicenseMode] = useState("select");
  const [newLicenseText, setNewLicenseText] = useState("");

  const officeOptions =
    officesFromContext.length > 0
      ? officesFromContext
      : [
          { id: "campbell", name: "Campbell Dental & Orthodontics", city: "Detroit" },
          { id: "vernor", name: "Vernor Dental Care", city: "Detroit" },
          { id: "allenwood", name: "Allenwood Dental - Woodhaven", city: "Woodhaven" },
        ];

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    return employees.filter((emp) => {
      if (officeFilter !== "all" && emp.officeId !== officeFilter) return false;
      if (!term) return true;
      const haystack = [
        emp.name,
        emp.preferredName,
        emp.role,
        emp.licenseType,
        emp.officeName,
        emp.badgeId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [employees, officeFilter, search]);

  const selectedEmployee =
    draft ||
    employees.find((emp) => emp.id === selectedEmployeeId) ||
    null;

  function openEmployee(emp) {
    setSelectedEmployeeId(emp.id);
    setDraft({ ...emp });
    setIsEditing(false);
    setIsCreating(false);
    setActiveTab("employment");
    setRoleMode("select");
    setNewRoleText("");
    setLicenseMode("select");
    setNewLicenseText("");
  }

  function startCreate() {
    const defaultOffice = officeOptions[0];
    const defaultRole = roles[0] || "Clinical Office Administrator";
    const defaultLicense = "Admin – No clinical license";

    const newEmp = {
      id: `emp-${Date.now()}`,
      badgeId: generateBadgeId(),
      name: "",
      preferredName: "",
      role: defaultRole,
      officeId: defaultOffice.id,
      officeName: defaultOffice.name,
      licenseType: defaultLicense,
      licenseId: "",
      expires: "",
      clinicallyLicensed: inferClinicallyLicensed(defaultLicense),
      status: "Active",
      lastVerified: "",

      dob: "",
      mobilePhone: "",
      personalEmail: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",

      certCpr: false,
      certCprExpires: "",
      certXray: false,
      certXrayExpires: "",
      certOsha: false,
      certOshaExpires: "",
      otherCerts: "",

      employmentStatus: "Full time",
      payType: "Hourly",
      payRate: "",
      payCurrency: "USD",
      ptoEligible: true,
      compNotes: "",
    };

    setSelectedEmployeeId(newEmp.id);
    setDraft(newEmp);
    setIsEditing(true);
    setIsCreating(true);
    setActiveTab("employment");
    setRoleMode("select");
    setNewRoleText("");
    setLicenseMode("select");
    setNewLicenseText("");
  }

  function closeModal() {
    setSelectedEmployeeId(null);
    setDraft(null);
    setIsEditing(false);
    setIsCreating(false);
  }

  function handleFieldChange(field, value) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };

      if (field === "licenseType") {
        next.clinicallyLicensed = inferClinicallyLicensed(value);
      }

      if (field === "officeId") {
        const officeObj = officeOptions.find((o) => o.id === value);
        if (officeObj) {
          next.officeName = officeObj.name;
        }
      }

      return next;
    });
  }

  function handleCheckboxChange(field, checked) {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: checked };
    });
  }

  function handleSave(e) {
    if (e) e.preventDefault();
    if (!draft) return;

    if (isCreating) {
      setEmployees((prev) => [...prev, { ...draft }]);
    } else {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === draft.id ? { ...draft } : emp))
      );
    }

    closeModal();
  }

  function handleAddRole(e) {
    e.preventDefault();
    const clean = toTitleCase(newRoleText.trim());
    if (!clean) return;
    if (!roles.includes(clean)) {
      setRoles((prev) => [...prev, clean]);
    }
    handleFieldChange("role", clean);
    setRoleMode("select");
    setNewRoleText("");
    setIsEditing(true);
  }

  function handleAddLicenseType(e) {
    e.preventDefault();
    const clean = toTitleCase(newLicenseText.trim());
    if (!clean) return;
    if (!licenseTypes.includes(clean)) {
      setLicenseTypes((prev) => [...prev, clean]);
    }
    handleFieldChange("licenseType", clean);
    setLicenseMode("select");
    setNewLicenseText("");
    setIsEditing(true);
  }

  return (
    <div className="hr-page">
      <div className="hr-header-row">
        <div>
          <div className="hr-breadcrumb">HR · Licensing and credentials</div>
          <h1 className="hr-title">Team &amp; credentials</h1>
          <p className="hr-subtitle">
            Manage legal names, roles, licenses, demographics, pay, and required certifications.
          </p>
        </div>

        <div className="hr-filters">
          <div className="hr-filter">
            <label htmlFor="hr-search">Search</label>
            <input
              id="hr-search"
              type="text"
              placeholder="Search by name, role, license, or badge ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="hr-filter">
            <label htmlFor="hr-office-filter">Office</label>
            <select
              id="hr-office-filter"
              value={officeFilter}
              onChange={(e) => setOfficeFilter(e.target.value)}
            >
              <option value="all">All offices</option>
              {officeOptions.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="hr-layout">
        <section className="hr-team-card">
          <div className="hr-team-card-header">
            <div>
              <div className="hr-team-card-title">Team members</div>
              <div className="hr-team-card-subtitle">
                {filteredEmployees.length} active profile
                {filteredEmployees.length === 1 ? "" : "s"}
              </div>
            </div>
            <button
              type="button"
              className="btn-primary btn-small"
              onClick={startCreate}
            >
              + Add team member
            </button>
          </div>

          <ul className="hr-team-list">
            {filteredEmployees.map((emp) => (
              <li
                key={emp.id}
                className={
                  "hr-team-row" +
                  (emp.id === selectedEmployeeId ? " hr-team-row-selected" : "")
                }
                onClick={() => openEmployee(emp)}
              >
                <div className="hr-team-row-main">
                  <div className="hr-team-row-name">
                    {emp.preferredName || emp.name}
                  </div>
                  <div className="hr-team-row-role">
                    {emp.role}
                    {emp.badgeId && (
                      <span className="hr-team-row-badge"> · {emp.badgeId}</span>
                    )}
                  </div>
                </div>
                <div className="hr-team-row-meta">
                  <span className="hr-chip">{emp.officeName}</span>
                  <span className="hr-chip hr-chip-status">{emp.status}</span>
                  {emp.clinicallyLicensed ? (
                    <span className="hr-chip hr-chip-licensed">Licensed</span>
                  ) : (
                    <span className="hr-chip hr-chip-unlicensed">Not licensed</span>
                  )}
                </div>
              </li>
            ))}

            {filteredEmployees.length === 0 && (
              <li className="hr-team-row-empty">
                No team members match these filters.
              </li>
            )}
          </ul>
        </section>
      </div>

      {selectedEmployee && draft && (
        <div className="hr-modal-backdrop" onClick={closeModal}>
          <div
            className="hr-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="hr-modal-header">
              <div className="hr-modal-title-block">
                <div className="hr-modal-name-line">
                  <h2>{draft.preferredName || draft.name || "New team member"}</h2>
                  {draft.role && <span className="hr-modal-pill">{draft.role}</span>}
                  {draft.officeName && (
                    <span className="hr-modal-pill">{draft.officeName}</span>
                  )}
                  {draft.badgeId && (
                    <span className="hr-modal-pill">ID {draft.badgeId}</span>
                  )}
                </div>
                <p className="hr-modal-subtitle">
                  Changes are stored for audits, payroll, device logins, and license renewals.
                </p>
              </div>
              <div className="hr-modal-header-actions">
                {!isEditing && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit details
                  </button>
                )}
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </header>

            <div className="hr-modal-banner">
              {isEditing
                ? "You are editing this profile. Save changes to update the record."
                : "You are viewing this profile in read-only mode. Select Edit details to make updates."}
            </div>

            <form className="hr-modal-body" onSubmit={handleSave}>
              <div className="hr-tabs">
                <button
                  type="button"
                  className={
                    "hr-tab" + (activeTab === "employment" ? " hr-tab-active" : "")
                  }
                  onClick={() => setActiveTab("employment")}
                >
                  Employment &amp; license
                </button>
                <button
                  type="button"
                  className={
                    "hr-tab" + (activeTab === "demo" ? " hr-tab-active" : "")
                  }
                  onClick={() => setActiveTab("demo")}
                >
                  Demographics
                </button>
                <button
                  type="button"
                  className={
                    "hr-tab" + (activeTab === "certs" ? " hr-tab-active" : "")
                  }
                  onClick={() => setActiveTab("certs")}
                >
                  Certifications &amp; other licenses
                </button>
                <button
                  type="button"
                  className={
                    "hr-tab" + (activeTab === "pay" ? " hr-tab-active" : "")
                  }
                  onClick={() => setActiveTab("pay")}
                >
                  Pay &amp; salary
                </button>
              </div>

              {activeTab === "employment" && (
                <div className="hr-grid">
                  <div className="hr-field">
                    <label>Legal name</label>
                    <input
                      type="text"
                      value={draft.name}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      placeholder="First Last"
                    />
                  </div>
                  <div className="hr-field">
                    <label>Preferred / badge name</label>
                    <input
                      type="text"
                      value={draft.preferredName || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("preferredName", e.target.value)
                      }
                      placeholder="Name on badge"
                    />
                  </div>

                  <div className="hr-field">
                    <label>Employee / badge ID</label>
                    <input
                      type="text"
                      value={draft.badgeId || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("badgeId", e.target.value)
                      }
                      placeholder="Auto-generated, but editable"
                    />
                    <p className="hr-field-help">
                      Used for NFC badges, TV logins, and room presence tracking.
                    </p>
                  </div>
                  <div></div>

                  <div className="hr-field">
                    <label>Role</label>
                    {roleMode === "select" ? (
                      <select
                        value={draft.role}
                        disabled={!isEditing}
                        onChange={(e) => {
                          if (e.target.value === "__add_new") {
                            setRoleMode("add");
                            setNewRoleText("");
                          } else {
                            handleFieldChange("role", e.target.value);
                          }
                        }}
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                        <option value="__add_new">+ Add new role…</option>
                      </select>
                    ) : (
                      <div className="hr-inline-add">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Type new role"
                          value={newRoleText}
                          onChange={(e) => setNewRoleText(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={handleAddRole}
                        >
                          Save role
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => setRoleMode("select")}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="hr-field">
                    <label>Office</label>
                    <select
                      value={draft.officeId}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("officeId", e.target.value)
                      }
                    >
                      {officeOptions.map((office) => (
                        <option key={office.id} value={office.id}>
                          {office.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="hr-field">
                    <label>License type</label>
                    {licenseMode === "select" ? (
                      <select
                        value={draft.licenseType}
                        disabled={!isEditing}
                        onChange={(e) => {
                          if (e.target.value === "__add_new_license") {
                            setLicenseMode("add");
                            setNewLicenseText("");
                          } else {
                            handleFieldChange("licenseType", e.target.value);
                          }
                        }}
                      >
                        {licenseTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                        <option value="__add_new_license">
                          + Add new license type…
                        </option>
                      </select>
                    ) : (
                      <div className="hr-inline-add">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Type new license type"
                          value={newLicenseText}
                          onChange={(e) => setNewLicenseText(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={handleAddLicenseType}
                        >
                          Save type
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => setLicenseMode("select")}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="hr-field">
                    <label>Clinically licensed</label>
                    <div className="hr-pill-toggle">
                      <span className={draft.clinicallyLicensed ? "on" : ""}>
                        {draft.clinicallyLicensed ? "Yes" : "No"}
                      </span>
                    </div>
                    <p className="hr-field-help">
                      Automatically set based on license type.
                    </p>
                  </div>

                  <div className="hr-field">
                    <label>Status</label>
                    <select
                      value={draft.status}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange("status", e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="On leave">On leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="hr-field">
                    <label>License ID</label>
                    <input
                      type="text"
                      value={draft.licenseId}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("licenseId", e.target.value)
                      }
                    />
                  </div>

                  <div className="hr-field">
                    <label>License expires</label>
                    <input
                      type="date"
                      value={draft.expires || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("expires", e.target.value)
                      }
                    />
                  </div>

                  <div className="hr-field">
                    <label>Last verified with board</label>
                    <input
                      type="date"
                      value={draft.lastVerified || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("lastVerified", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {activeTab === "demo" && (
                <div className="hr-grid">
                  <div className="hr-section-title">Demographics</div>
                  <div></div>

                  <div className="hr-field">
                    <label>Date of birth</label>
                    <input
                      type="date"
                      value={draft.dob || ""}
                      disabled={!isEditing}
                      onChange={(e) => handleFieldChange("dob", e.target.value)}
                    />
                  </div>
                  <div className="hr-field">
                    <label>Mobile phone</label>
                    <input
                      type="tel"
                      value={draft.mobilePhone || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("mobilePhone", e.target.value)
                      }
                      placeholder="(555) 555-5555"
                    />
                  </div>

                  <div className="hr-field">
                    <label>Personal email</label>
                    <input
                      type="email"
                      value={draft.personalEmail || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("personalEmail", e.target.value)
                      }
                      placeholder="name@example.com"
                    />
                  </div>
                  <div></div>

                  <div className="hr-field">
                    <label>Address line 1</label>
                    <input
                      type="text"
                      value={draft.address1 || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("address1", e.target.value)
                      }
                    />
                  </div>
                  <div className="hr-field">
                    <label>Address line 2</label>
                    <input
                      type="text"
                      value={draft.address2 || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("address2", e.target.value)
                      }
                    />
                  </div>

                  <div className="hr-field">
                    <label>City</label>
                    <input
                      type="text"
                      value={draft.city || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div className="hr-field">
                    <label>State</label>
                    <input
                      type="text"
                      value={draft.state || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("state", e.target.value)
                      }
                      placeholder="MI"
                    />
                  </div>

                  <div className="hr-field">
                    <label>Postal code</label>
                    <input
                      type="text"
                      value={draft.postalCode || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("postalCode", e.target.value)
                      }
                    />
                  </div>
                  <div></div>

                  <div className="hr-section-title">Emergency contact</div>
                  <div></div>

                  <div className="hr-field">
                    <label>Contact name</label>
                    <input
                      type="text"
                      value={draft.emergencyContactName || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("emergencyContactName", e.target.value)
                      }
                    />
                  </div>
                  <div className="hr-field">
                    <label>Relationship</label>
                    <input
                      type="text"
                      value={draft.emergencyContactRelation || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange(
                          "emergencyContactRelation",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="hr-field">
                    <label>Contact phone</label>
                    <input
                      type="tel"
                      value={draft.emergencyContactPhone || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange(
                          "emergencyContactPhone",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              )}

              {activeTab === "certs" && (
                <div className="hr-grid">
                  <div className="hr-section-title">
                    Certifications &amp; required credentials
                  </div>
                  <div></div>

                  <div className="hr-field hr-field-inline">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!draft.certCpr}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleCheckboxChange("certCpr", e.target.checked)
                        }
                      />
                      <span>CPR / BLS</span>
                    </label>
                  </div>
                  <div className="hr-field">
                    <label>CPR expires</label>
                    <input
                      type="date"
                      value={draft.certCprExpires || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("certCprExpires", e.target.value)
                      }
                    />
                  </div>

                  <div className="hr-field hr-field-inline">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!draft.certXray}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleCheckboxChange("certXray", e.target.checked)
                        }
                      />
                      <span>X-ray certification</span>
                    </label>
                  </div>
                  <div className="hr-field">
                    <label>X-ray cert expires</label>
                    <input
                      type="date"
                      value={draft.certXrayExpires || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("certXrayExpires", e.target.value)
                      }
                    />
                  </div>

                  <div className="hr-field hr-field-inline">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!draft.certOsha}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleCheckboxChange("certOsha", e.target.checked)
                        }
                      />
                      <span>OSHA / infection control</span>
                    </label>
                  </div>
                  <div className="hr-field">
                    <label>OSHA last training</label>
                    <input
                      type="date"
                      value={draft.certOshaExpires || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("certOshaExpires", e.target.value)
                      }
                    />
                  </div>

                  <div className="hr-field hr-field-full">
                    <label>Other certifications / notes</label>
                    <textarea
                      rows={3}
                      value={draft.otherCerts || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("otherCerts", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {activeTab === "pay" && (
                <div className="hr-grid">
                  <div className="hr-section-title">Pay &amp; salary</div>
                  <div></div>

                  <div className="hr-field">
                    <label>Employment status</label>
                    <select
                      value={draft.employmentStatus || "Full time"}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("employmentStatus", e.target.value)
                      }
                    >
                      <option value="Full time">Full time</option>
                      <option value="Part time">Part time</option>
                      <option value="Per diem">Per diem</option>
                    </select>
                  </div>
                  <div className="hr-field">
                    <label>Pay type</label>
                    <select
                      value={draft.payType || "Hourly"}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("payType", e.target.value)
                      }
                    >
                      <option value="Hourly">Hourly</option>
                      <option value="Salary">Salary</option>
                    </select>
                  </div>

                  <div className="hr-field">
                    <label>Base rate</label>
                    <input
                      type="number"
                      step="0.01"
                      value={draft.payRate || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("payRate", e.target.value)
                      }
                      placeholder="e.g. 24.50"
                    />
                  </div>
                  <div className="hr-field">
                    <label>Currency</label>
                    <input
                      type="text"
                      value={draft.payCurrency || "USD"}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("payCurrency", e.target.value)
                      }
                    />
                  </div>

                  <div className="hr-field hr-field-inline">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!draft.ptoEligible}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleCheckboxChange("ptoEligible", e.target.checked)
                        }
                      />
                      <span>Eligible for PTO</span>
                    </label>
                  </div>
                  <div></div>

                  <div className="hr-field hr-field-full">
                    <label>Compensation notes</label>
                    <textarea
                      rows={3}
                      value={draft.compNotes || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFieldChange("compNotes", e.target.value)
                      }
                      placeholder="Internal-only notes about pay bands, reviews, or bonus structure."
                    />
                  </div>
                </div>
              )}

              <footer className="hr-modal-footer">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!isEditing}
                >
                  Save changes
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
