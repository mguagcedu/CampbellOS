import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const OfficeContext = createContext(null);

export function OfficeProvider({ children }) {
  const { user } = useAuth();

  const offices = [
    "All offices",
    "Campbell Dental",
    "Vernor Dental",
    "Allenwood Dental",
  ];

  const defaultOffice =
    user?.office && offices.includes(user.office) ? user.office : "Campbell Dental";

  const [currentOffice, setCurrentOffice] = useState(defaultOffice);

  // When logged-in user changes (or logs out), reset office
  useEffect(() => {
    if (user?.office && offices.includes(user.office)) {
      setCurrentOffice(user.office);
    } else {
      setCurrentOffice("Campbell Dental");
    }
  }, [user]);

  return (
    <OfficeContext.Provider
      value={{
        offices,
        currentOffice,
        setCurrentOffice,
      }}
    >
      {children}
    </OfficeContext.Provider>
  );
}

export function useOffice() {
  const ctx = useContext(OfficeContext);
  if (!ctx) {
    throw new Error("useOffice must be used within OfficeProvider");
  }
  return ctx;
}
