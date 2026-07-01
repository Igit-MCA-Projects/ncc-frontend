import { createContext, useContext, useEffect, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        darkMode,
        setDarkMode,
        notificationsEnabled,
        setNotificationsEnabled,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return /** @type {{ sidebarOpen: boolean, setSidebarOpen: (v: boolean) => void, darkMode: boolean, setDarkMode: (v: boolean) => void, notificationsEnabled: boolean, setNotificationsEnabled: (v: boolean) => void }} */ (ctx);
};
