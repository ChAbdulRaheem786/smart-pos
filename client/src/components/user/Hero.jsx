import { useEffect, useState } from "react";
import { useSettings } from "../../context/SettingsContext";

export default function Hero() {
  const { settings } = useSettings();
  const banners = settings?.headerBanners || [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Ambient glow, always present */}
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Rotating banner backdrop */}
      {banners.length > 0 && (
        <div className="absolute inset-0">
          {banners.map((b, i) => (
            <img
              key={b._id || i}
              src={b.url}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === index ? "opacity-70" : "opacity-0"
              }`}
            />
          ))}
          {/* Light overall tint so text stays legible, plus a soft bottom fade for depth */}
          <div className="absolute inset-0 bg-bg/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
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

      {banners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-brand" : "w-1.5 bg-ink-faint"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
