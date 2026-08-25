import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";
import { useGoToCategory } from "../../hooks/useGoToCategory";

export default function Navbar() {
  const { totalItems } = useCart();
  const { settings, categories } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const goToCategory = useGoToCategory();

  const handleCategoryClick = (slug) => {
    setMenuOpen(false);
    goToCategory(slug);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-bg font-display text-sm font-bold">
            {settings?.siteName?.[0]?.toUpperCase() || "S"}
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {settings?.siteName || "Smart Store"}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft lg:flex">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "text-brand" : "hover:text-ink transition-colors")}>
            Home
          </NavLink>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="hover:text-ink transition-colors"
            >
              {cat.name}
            </button>
          ))}
          <a href="#about" className="hover:text-ink transition-colors">About</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium hover:border-brand transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-bg">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-bg px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-ink-soft">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-ink">Home</Link>
            {categories.map((cat) => (
              <button key={cat._id} onClick={() => handleCategoryClick(cat.slug)} className="text-left hover:text-ink">
                {cat.name}
              </button>
            ))}
            <a href="#about" onClick={() => setMenuOpen(false)} className="hover:text-ink">About</a>
          </div>
        </div>
      )}
    </header>
  );
}
