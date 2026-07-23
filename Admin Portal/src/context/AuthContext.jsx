import { createContext, useContext, useEffect, useState } from "react";
import {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} from "@/services/adminService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await getAdminProfile();

        if (response.success) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (creds) => {
    await loginAdmin(creds);

    const profile = await getAdminProfile();

    if (profile.success) {
      setUser(profile.data);
      return profile.data;
    }

    setUser(null);
    return null;
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, setReady, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return /** @type {{ user: any, setUser: (u: any) => void, login: (c: any) => Promise<any>, logout: () => void, ready: boolean }} */ (ctx);
};
