import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Skooldiplex brand — single amber accent on navy/slate neutrals
        brand: {
          amber: "#FAA91A",
          amberDark: "#C2410C",
          navy: "#0B101E",
          navy2: "#0D142A",
          slate: "#1E293B",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // tinted, diffuse shadow (no neon glow)
        card: "0 10px 30px -12px rgba(11, 16, 30, 0.12)",
        nav: "0 -8px 24px -16px rgba(11, 16, 30, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
