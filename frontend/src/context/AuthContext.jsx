import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore saved session if it exists
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("cbos_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("cbos_token") || null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("cbos_user");
      localStorage.removeItem("cbos_token");
    } catch {
      // ignore
    }
  }, []);

  // LOGIN — this is what the Login page calls
  const login = useCallback(
    async (email, password, deviceType) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, deviceType }),
        });

        if (!res.ok) {
          throw new Error("Login failed");
        }

        const data = await res.json();

        // Backend might send user + token, but make it safe if it doesn't
        const safeUser =
          data.user ||
          ({
            email,
            role: data.role || "staff",
            office: data.office || "Campbell Dental",
          });

        const safeToken = data.token || "demo-token";

        setUser(safeUser);
        setToken(safeToken);

        try {
          localStorage.setItem("cbos_user", JSON.stringify(safeUser));
          localStorage.setItem("cbos_token", safeToken);
        } catch {
          // ignore storage errors
        }

        return { success: true };
      } catch (err) {
        console.error("Login error:", err);
        setError("Login failed. Check your credentials.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  // 15-minute inactivity timeout
  useEffect(() => {
    if (!user) return;

    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        clearSession();
        window.location.href = "/login";
      }, 15 * 60 * 1000); // 15 minutes
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [user, clearSession]);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
