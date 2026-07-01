import { createContext, useContext, useEffect, useState } from "react";
import { loginAdmin } from "@/services/adminService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("ncc_admin_token");
    const stored = localStorage.getItem("ncc_admin_user");
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setReady(true);
  }, []);

  const login = async (creds) => {
    const { data } = await loginAdmin(creds);
    localStorage.setItem("ncc_admin_token", data.token);
    localStorage.setItem("ncc_admin_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("ncc_admin_token");
    localStorage.removeItem("ncc_admin_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return /** @type {{ user: any, setUser: (u: any) => void, login: (c: any) => Promise<any>, logout: () => void, ready: boolean }} */ (ctx);
};
