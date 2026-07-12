import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Restore session from localStorage on mount (survives hard-refresh)
  useEffect(() => {
    const saved = localStorage.getItem("ncc.user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
    setReady(true);
  }, []);

  const register = async ({ fullName, email, password }) => {
    return await authApi.registerStudent({ fullName, email, password });
  };

  const verifyEmail = async ({ email, otp }) => {
    return await authApi.verifyEmail({ email, otp });
  };

  const login = async ({ email, password }) => {
    const data = await authApi.loginStudent({ email, password });
    // Backend uses httpOnly cookie — response data may be null.
    // Use whatever user info came back, or a minimal stub so ProtectedRoute passes.
    const userObj = data?.data || { loggedIn: true };
    setUser(userObj);
    localStorage.setItem("ncc.user", JSON.stringify(userObj));
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logoutStudent();
    } finally {
      setUser(null);
      localStorage.removeItem("ncc.user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, ready, register, verifyEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
