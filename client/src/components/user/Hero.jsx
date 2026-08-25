import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

export default function Hero() {
  const { settings } = useSettings();
  const banner = settings?.headerBanners?.[0];

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Ambient glow + optional banner image backdrop */}
      <div className="absolute inset-0 bg-radial-glow" />
      {banner?.url && (
        <div className="absolute inset-0">
          <img src={banner.url} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40" />
        </div>
      )}

      <div className="relative mx-auto max-w-5xl px-5 py-24 text-center sm:py-32">
        <span className="section-eyebrow">{settings?.siteName || "Smart Store"}</span>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          {settings?.heroTagline || "Quality goods, delivered with care."}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
          Browse our latest arrivals, pick your favorites, and order in a couple of taps —
          no account needed.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#products" className="btn-primary shadow-glow">
            Shop now
          </a>
          <a href="#about" className="btn-secondary">
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
