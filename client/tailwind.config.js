/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EC",
        ink: "#161A2B",
        "ink-soft": "#2B3049",
        brand: {
          DEFAULT: "#0F8B77",
          dark: "#0B6B5C",
          light: "#E4F3EF",
        },
        amber: {
          DEFAULT: "#E8A33D",
          dark: "#C2811F",
        },
        line: "#E4DFD1",
        admin: {
          bg: "#12152A",
          surface: "#1B2038",
          surface2: "#232A4A",
          border: "#2E3559",
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
        card: "0 1px 2px rgba(22,26,43,0.04), 0 8px 24px -12px rgba(22,26,43,0.12)",
        cardHover: "0 4px 8px rgba(22,26,43,0.06), 0 16px 32px -12px rgba(22,26,43,0.18)",
      },
    },
  },
  plugins: [],
};
