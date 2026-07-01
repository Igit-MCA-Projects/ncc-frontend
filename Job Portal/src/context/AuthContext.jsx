import { createContext, useContext, useEffect, useState } from "react";
import * as apiSvc from "../services/api";

const AuthContext = createContext(null);
const KEY = "ncc.auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setUser(JSON.parse(raw).user);
    } catch {}
    setReady(true);
  }, []);

  const persist = (data) => {
    localStorage.setItem(KEY, JSON.stringify(data));
    setUser(data.user);
  };

  const login = async (creds) => {
    const data = await apiSvc.login(creds);
    persist(data);
    return data;
  };
  const register = async (payload) => {
    const data = await apiSvc.register(payload);
    persist(data);
    return data;
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
