import { NavLink, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const links = [
  { to: "/admin/dashboard", label: "Overview", icon: "▤" },
  { to: "/admin/categories", label: "Categories", icon: "▥" },
  { to: "/admin/products", label: "Products", icon: "▦" },
  { to: "/admin/orders", label: "Orders", icon: "✎" },
  { to: "/admin/settings", label: "Banners & settings", icon: "◧" },
];

export default function AdminLayout() {
  const { logout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-admin-bg text-paper">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-admin-border p-5 sm:flex">
        <div className="mb-8 flex items-center gap-2 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand font-display text-sm font-bold text-white">
            A
          </span>
          <span className="font-display text-base font-semibold">Admin panel</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-admin-surface2 text-paper"
                    : "text-paper/60 hover:bg-admin-surface hover:text-paper"
                }`
              }
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-4 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-paper/50 hover:bg-admin-surface hover:text-red-400"
        >
          Log out
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-admin-border bg-admin-bg px-4 py-3 sm:hidden">
        <span className="font-display text-sm font-semibold">Admin panel</span>
        <button onClick={logout} className="text-xs text-paper/50">Log out</button>
      </div>

      <div className="flex-1 pt-14 sm:pt-0">
        <div className="border-b border-admin-border px-4 py-3 sm:hidden overflow-x-auto flex gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `shrink-0 text-xs font-medium ${isActive ? "text-brand" : "text-paper/50"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
