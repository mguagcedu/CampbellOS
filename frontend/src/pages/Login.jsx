import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Login.css";
import logo from "../assets/campbell-logo-white.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("carolina@campbelldental1.com");
  const [password, setPassword] = useState("Carolina123!");
  const [device, setDevice] = useState("Office device");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password, device, API_BASE);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-pill">
          <img
            src={logo}
            alt="Campbell Dental logo"
            className="login-logo-img"
          />
        </div>

        <h1 className="login-title">CampbellOS Login</h1>
        <p className="login-subtitle">
          Use your Campbell Dental credentials to access the system.
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Email
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="login-label">
            Password
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <label className="login-label">
            Device
            <select
              className="login-input"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
            >
              <option>Office device</option>
              <option>Personal device</option>
              <option>Shared front desk PC</option>
            </select>
          </label>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="login-divider" />

        <div className="login-sample-users">
          <p className="login-sample-title">Sample users:</p>
          <ul>
            <li>
              carolina@campbelldental1.com / <strong>Carolina123!</strong> (admin)
            </li>
            <li>
              manny@campbelldental1.com / <strong>Manny123!</strong> (manager)
            </li>
            <li>
              frontdesk@campbelldental1.com / <strong>FrontDesk123!</strong> (front desk)
            </li>
            <li>
              assistant@campbelldental1.com / <strong>Assistant123!</strong> (assistant)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
