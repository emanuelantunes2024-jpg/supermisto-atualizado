import type { Config } from "tailwindcss";

/**
 * Paleta extraída del prototipo oficial de marca (design-reference.md):
 * navy profundo + dorado. No cambiar sin actualizar la referencia de marca.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070c18",
          900: "#0b1424",
          800: "#101c33",
          700: "#172845",
          600: "#23375c",
        },
        gold: {
          400: "#f4c565",
          500: "#e7a63c",
          600: "#c88423",
        },
        ink: {
          DEFAULT: "#eef1f8",
          muted: "#a8b3cc",
        },
        line: "rgba(255,255,255,0.09)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Sora", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        shell: "1240px",
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        lg: "0 20px 60px rgba(0,0,0,0.45)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        fadeUp: "fadeUp .7s ease forwards",
        floatY: "floatY 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
