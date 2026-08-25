import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [settingsRes, categoriesRes] = await Promise.all([
          api.get("/settings"),
          api.get("/categories"),
        ]);
        setSettings(settingsRes.data);
        setCategories(categoriesRes.data);
      } catch {
        // Storefront still renders without settings/categories loaded; individual
        // sections handle their own empty states.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, categories, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
