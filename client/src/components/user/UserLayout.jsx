import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SettingsProvider } from "../../context/SettingsContext";

export default function UserLayout() {
  return (
    <SettingsProvider>
      <div className="min-h-screen bg-bg">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </SettingsProvider>
  );
}
