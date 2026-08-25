import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  const verify = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setIsAuthed(false);
      setChecking(false);
      return;
    }
    try {
      const { data } = await api.get("/admin/verify");
      setIsAuthed(!!data.valid);
    } catch {
      setIsAuthed(false);
      localStorage.removeItem("adminToken");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (password) => {
    const { data } = await api.post("/admin/login", { password });
    localStorage.setItem("adminToken", data.token);
    setIsAuthed(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthed(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthed, checking, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
