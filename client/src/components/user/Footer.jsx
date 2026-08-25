import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

export default function Footer() {
  const { settings, categories } = useSettings();
  const social = settings?.socialLinks || {};
  const hasSocial = social.instagram || social.tiktok || social.facebook;

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-bg font-display text-sm font-bold">
                {settings?.siteName?.[0]?.toUpperCase() || "S"}
              </span>
              <span className="font-display text-lg font-semibold">{settings?.siteName || "Smart Store"}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              {settings?.heroTagline || "Quality goods, delivered with care."}
            </p>
          </div>

          {categories.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Categories</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                {categories.slice(0, 6).map((c) => (
                  <li key={c._id}>
                    <Link to={`/?category=${c.slug}#products`} className="hover:text-brand transition-colors">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              <li><a href="#products" className="hover:text-brand transition-colors">All products</a></li>
              <li><a href="#about" className="hover:text-brand transition-colors">About us</a></li>
              <li><Link to="/cart" className="hover:text-brand transition-colors">Cart</Link></li>
            </ul>
          </div>

          {hasSocial && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Follow us</p>
              <div className="mt-4 flex gap-3">
                {social.instagram && (
                  <SocialIcon href={social.instagram} label="Instagram">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </SocialIcon>
                )}
                {social.tiktok && (
                  <SocialIcon href={social.tiktok} label="TikTok">
                    <path d="M16 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
                    <path d="M16 3c.5 3 2.5 5 6 5.5" />
                  </SocialIcon>
                )}
                {social.facebook && (
                  <SocialIcon href={social.facebook} label="Facebook">
                    <path d="M14 9V6a1 1 0 0 1 1-1h2V2h-3a4 4 0 0 0-4 4v3H8v3h2v9h3v-9h2.5l.5-3H13Z" />
                  </SocialIcon>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-ink-faint sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {settings?.siteName || "Smart Store"}. All rights reserved.</p>
          <p>Built for a smart, modern business.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-brand hover:text-brand"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </a>
  );
}
