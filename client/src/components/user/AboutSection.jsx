import { useSettings } from "../../context/SettingsContext";

export default function AboutSection() {
  const { settings } = useSettings();

  const text =
    settings?.aboutText?.trim() ||
    "We're a small business focused on getting you good products, fast — pick what you like, place your order, and we'll take it from there.";

  return (
    <section id="about" className="border-b border-line py-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <span className="section-eyebrow">About us</span>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          {settings?.siteName ? `The story behind ${settings.siteName}` : "Our story"}
        </h2>
        <p className="mx-auto mt-6 whitespace-pre-line text-base leading-relaxed text-ink-soft">
          {text}
        </p>
      </div>
    </section>
  );
}
