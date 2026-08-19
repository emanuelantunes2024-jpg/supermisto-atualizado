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
          950: "#08090b",
          900: "#0d0f12",
          800: "#16181c",
          700: "#202329",
          600: "#2c3039",
        },
        gold: {
          400: "#ffc75f",
          500: "#f0a730",
          600: "#c9820f",
        },
        orange: {
          500: "#ff7a3d",
          600: "#e85d1f",
        },
        ink: {
          DEFAULT: "#f5f6f8",
          muted: "#a3a8b3",
        },
        line: "rgba(255,255,255,0.1)",
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
