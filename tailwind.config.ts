import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /**
         * Skooldiplex brand — locked palette (brand-spec.md).
         * Warm cinema, premium, not loud. Amber is the single accent;
         * navy carries premium dark surfaces; neutrals are warm-tinted.
         */
        brand: {
          amber: "#FAA91A", // primary accent — CTAs, active, rating
          amberWarm: "#FFB300", // highlight / hover (use sparingly)
          amberInk: "#8A5A00", // accessible amber-family text on light (gold, never orange-red)
          amberSoft: "#FFEFD2", // amber wash for tinted fills
          navy: "#0B101E", // deepest premium surface
          navy2: "#121A30", // elevated navy (cards on navy, screen bar)
          navy3: "#1E2A46", // navy borders / hover on dark
        },
        ink: "#14182A", // primary text (navy-cool near-black)
        muted: "#5C6478", // secondary text
        faint: "#8E94A4", // tertiary / placeholder
        paper: "#FFF8F0", // warm page background
        paper2: "#FBF0E4", // warm alternate section
        surface: "#FFFFFF", // cards
        line: "#EFE6D8", // warm hairline border
        line2: "#E4D9C8", // warm stronger border
      },
      fontFamily: {
        sans: ["var(--font-rubik)", "var(--font-thai)", "system-ui", "sans-serif"],
        thai: ["var(--font-thai)", "var(--font-rubik)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // soft, warm, diffuse — "subtle elevation, not heavy shadows"
        card: "0 1px 2px rgba(20,24,42,0.04), 0 8px 24px -16px rgba(20,24,42,0.18)",
        cardHover: "0 2px 4px rgba(20,24,42,0.06), 0 16px 36px -18px rgba(20,24,42,0.24)",
        nav: "0 -1px 0 rgba(20,24,42,0.04), 0 -10px 30px -22px rgba(20,24,42,0.30)",
        poster: "0 10px 30px -14px rgba(11,16,30,0.55)",
        amber: "0 8px 24px -10px rgba(250,169,26,0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
      },
      letterSpacing: {
        brand: "0.22em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
