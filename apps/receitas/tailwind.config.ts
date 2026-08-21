import type { Config } from "tailwindcss";

/**
 * Identidade visual da Central de Receitas & Renda.
 *
 * A paleta sai da referência oficial enviada pelo proprietário: fundo creme,
 * cartões brancos, coral quente como cor de ação e verde só para dinheiro.
 * Não trocar sem atualizar `docs/IDENTIDADE-VISUAL.md`.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Fundo da aplicação (creme quente, "cozinha com luz natural").
        cream: {
          50: "#FFFCF9",
          100: "#FDF7F1",
          200: "#F8EDE3",
          300: "#F1E0D0",
        },
        // Coral: cor de marca e de toda ação principal.
        brand: {
          50: "#FFF3EE",
          100: "#FFE3D8",
          200: "#FFC7B2",
          300: "#FFA285",
          400: "#FB7D57",
          500: "#F2643C",
          600: "#E14E27",
          700: "#BC3D1B",
          800: "#933016",
        },
        // Âmbar: destaques secundários, selos de "novo".
        amber: {
          100: "#FFF0D6",
          400: "#F7B948",
          500: "#EFA31D",
          600: "#CE8408",
        },
        // Verde: exclusivo para valores financeiros simulados.
        money: {
          50: "#EAF8F0",
          500: "#15A34A",
          600: "#0F8A3D",
          700: "#0B6C30",
        },
        ink: {
          DEFAULT: "#22201E",
          soft: "#4A443F",
          muted: "#857C74",
          faint: "#B3A99F",
        },
        line: {
          DEFAULT: "#EFE3D8",
          soft: "#F6EDE5",
        },
        // Painel administrativo: escuro, para separar do app do cliente.
        panel: {
          900: "#141A24",
          800: "#1B2330",
          700: "#252F3E",
          600: "#33404F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(64, 43, 30, 0.05)",
        raised: "0 10px 30px rgba(64, 43, 30, 0.10)",
        pop: "0 18px 50px rgba(64, 43, 30, 0.16)",
      },
      screens: {
        // A partir daqui cabe a barra lateral fixa; abaixo vira menu de gaveta.
        app: "1024px",
      },
      maxWidth: {
        shell: "1400px",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp .5s ease forwards",
        slideIn: "slideIn .25s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
