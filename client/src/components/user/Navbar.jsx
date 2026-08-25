import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Navbar({ siteName }) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-paper font-display text-sm font-bold">
            {siteName?.[0]?.toUpperCase() || "S"}
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {siteName || "Smart Store"}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft sm:flex">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "text-ink" : "hover:text-ink")}>
            Shop
          </NavLink>
        </nav>

        <Link
          to="/cart"
          className="relative flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-ink transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Cart
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
