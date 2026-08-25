import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BannerSwiper({ banners = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-line px-0 sm:px-5 sm:pt-5">
      <div className="relative aspect-[16/7] w-full overflow-hidden sm:rounded-2xl">
        {banners.map((b, i) => {
          const slide = (
            <img
              src={b.url}
              alt={b.title || "Store banner"}
              className="h-full w-full object-cover"
            />
          );
          return (
            <div
              key={b._id || i}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {b.link ? <Link to={b.link}>{slide}</Link> : slide}
              {b.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/70 to-transparent p-6">
                  <p className="font-display text-xl font-semibold text-paper sm:text-2xl">
                    {b.title}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-paper" : "w-1.5 bg-paper/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
