import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      boxShadow: {
        soft: "0 2px 6px rgba(124,45,18,0.08)",
        strong: "0 16px 35px rgba(124,45,18,0.16)",
      },
      borderRadius: {
        mdx: "16px",
        lgx: "24px",
      },
      fontFamily: {
        sans: ["DMSans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Oceanic", "cursive"],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
