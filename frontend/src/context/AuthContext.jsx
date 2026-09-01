import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

// Provides the logged-in user (or null) to the whole app, and loads it once on startup
// by asking the backend who the current session belongs to. Works the same whether
// the logged-in account is a customer or the seller — the backend tells us via `role`.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.get("/api/auth/current-user");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (phone, password) => {
    const data = await api.post("/api/auth/login", { phone, password });
    setUser(data.user);
    return data.user;
  };

  const register = async (phone, password, confirmPassword) => {
    const data = await api.post("/api/auth/register", { phone, password, confirmPassword });
    setUser(data.user);
    return data.user;
  };

  const sellerLogin = async (sellerId, password) => {
    const data = await api.post("/api/auth/seller/login", { sellerId, password });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.post("/api/auth/logout", {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, sellerLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
