/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Dark storefront palette
        bg: "#0A0B10",
        surface: "#121420",
        surface2: "#191C2C",
        surface3: "#212540",
        line: "#262A40",
        ink: "#F5F3EC",
        "ink-soft": "#A6ABC2",
        "ink-faint": "#6B7091",

        brand: {
          DEFAULT: "#1FE3B0",
          dark: "#12B98E",
          light: "#0F3A34",
        },
        amber: {
          DEFAULT: "#F2B705",
          dark: "#C99604",
        },

        // Admin panel keeps its own near-identical dark surfaces (kept as separate
        // tokens in case the two are ever styled differently later)
        admin: {
          bg: "#0A0B10",
          surface: "#121420",
          surface2: "#191C2C",
          border: "#262A40",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -12px rgba(0,0,0,0.5)",
        cardHover: "0 4px 12px rgba(0,0,0,0.4), 0 20px 40px -12px rgba(0,0,0,0.6)",
        glow: "0 0 60px -10px rgba(31,227,176,0.35)",
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(31,227,176,0.16) 0%, rgba(10,11,16,0) 70%)",
      },
    },
  },
  plugins: [],
};
