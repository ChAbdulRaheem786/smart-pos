import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import api from "../../api/axios";

export default function UserLayout() {
  const [siteName, setSiteName] = useState("");

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setSiteName(res.data.siteName))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar siteName={siteName} />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-line py-8 text-center text-xs text-ink-soft/60">
        {siteName || "Smart Store"} — Powered by your own storefront.
      </footer>
    </div>
  );
}
