import { createContext, useContext, useState } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 
  const [user, setUser] = useState(null);

  
  const register = async ({ fullName, email, password }) => {
    return await authApi.registerStudent({ fullName, email, password });
  };

  
  const verifyEmail = async ({ email, otp }) => {
    return await authApi.verifyEmail({ email, otp });
  };

  
  const login = async ({ email, password }) => {
    const data = await authApi.loginStudent({ email, password });
    if (data?.data) setUser(data.data);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logoutStudent();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, register, verifyEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
