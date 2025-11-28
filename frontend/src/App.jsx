import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import Login from "./pages/Login.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FrontDeskPage from "./pages/FrontDeskPage.jsx";
import RoomsPage from "./pages/RoomsPage.jsx";
import HrPage from "./pages/HrPage.jsx";
import TicketingPage from "./pages/TicketingPage.jsx";
import AdpDemoPage from "./pages/AdpDemoPage.jsx";
import TimeClockPage from "./pages/TimeClockPage.jsx";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {user ? (
        // All authenticated routes share the same app shell
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/frontdesk" element={<FrontDeskPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/hr" element={<HrPage />} />
          <Route path="/tickets" element={<TicketingPage />} />

          {/* New: Time clock + ADP demo */}
          <Route path="/time-clock" element={<TimeClockPage />} />
          <Route path="/adp-demo" element={<AdpDemoPage />} />

          {/* Default authenticated route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        // If not logged in, force everything to /login
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default App;
