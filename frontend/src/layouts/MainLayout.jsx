import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useApp } from "../context/AppContext.jsx";
import "./MainLayout.css";
import logo from "../assets/campbell-logo-white.png";

export default function MainLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { offices, selectedOfficeId, setSelectedOfficeId } = useApp() || {};

  const isHrPage = location.pathname.startsWith("/hr");

  const officeList =
    offices && offices.length
      ? offices
      : [
          { id: "campbell", name: "Campbell Dental & Orthodontics", city: "Detroit" },
          { id: "vernor", name: "Vernor Dental Care", city: "Detroit" },
          { id: "allenwood", name: "Allenwood Dental - Woodhaven", city: "Woodhaven" },
        ];

  const currentOffice =
    officeList.find((o) => o.id === selectedOfficeId) || officeList[0];

  const userName = user?.name || "Carolina";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = user?.role || "admin";

  const handleOfficeChange = (e) => {
    if (setSelectedOfficeId) {
      setSelectedOfficeId(e.target.value);
    }
  };

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Campbell Dental logo" className="sidebar-logo-img" />
          <div className="sidebar-product">
            <div className="sidebar-product-name">CampbellOS</div>
            <div className="sidebar-product-subtitle">Clinical Operations Suite</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Overview</div>
          <NavLink to="/dashboard" className="sidebar-link">
            <span className="sidebar-link-label">Practice Dashboard</span>
          </NavLink>
          <NavLink to="/frontdesk" className="sidebar-link">
            <span className="sidebar-link-label">Front Desk &amp; Schedule</span>
          </NavLink>
          <NavLink to="/rooms" className="sidebar-link">
            <span className="sidebar-link-label">Rooms &amp; Presence</span>
          </NavLink>

          <div className="sidebar-section-label">People</div>
          <NavLink to="/hr" className={`sidebar-link ${isHrPage ? "is-active-section" : ""}`}>
            <span className="sidebar-link-label">HR &amp; Credentials</span>
          </NavLink>

          <div className="sidebar-section-label">Systems</div>
          <NavLink to="/tickets" className="sidebar-link">
            <span className="sidebar-link-label">IT &amp; Ticketing</span>
          </NavLink>

          <div className="sidebar-section-label">Time &amp; attendance</div>
          <NavLink to="/time-clock" className="sidebar-link">
            <span className="sidebar-link-label">Time clock</span>
          </NavLink>
          <NavLink to="/adp-demo" className="sidebar-link">
            <span className="sidebar-link-label">ADP demo queue</span>
          </NavLink>
        </nav>
      </aside>

      <div className="main-body">
        <header className="main-header">
          <div className="main-header-left">
            <div className="main-header-practice">
              <div className="main-header-practice-name">
                {currentOffice?.name || "Campbell Dental & Orthodontics"}
              </div>
              <div className="main-header-practice-meta">
                {currentOffice?.city || "Detroit"}
              </div>
            </div>

            <div className="main-header-office-selector">
              <label className="office-select-label">
                Location
                <select
                  className="office-select"
                  value={currentOffice.id}
                  onChange={handleOfficeChange}
                >
                  {officeList.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="main-header-right">
            <div className="user-chip">
              <div className="user-avatar">{userInitial}</div>
              <div className="user-meta">
                <div className="user-name">{userName}</div>
                <div className="user-role">{userRole}</div>
              </div>
            </div>
            <button className="logout-button" type="button" onClick={logout}>
              Log out
            </button>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
