import type { Config } from "tailwindcss";
export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { forest: "#06210f", emerald: { DEFAULT: "#0f7a2f", soft: "#e4f5e4" }, gold: "#ffd400" },
    fontFamily: { bn: ["var(--font-bn)", "Noto Sans Bengali", "sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
