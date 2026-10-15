import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        foreground: "#f8fafc",
        board: {
          dark: "#1e293b",
          border: "#334155",
          cell: "#0f172a",
        },
      },
      animation: {
        "pop-in": "popIn 150ms ease-out",
        "merge": "mergePop 200ms ease-in-out",
        "rotate-board": "rotateBoard 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        mergePop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        rotateBoard: {
          "0%": { transform: "rotate(var(--from-deg, 0deg))" },
          "100%": { transform: "rotate(var(--to-deg, 90deg))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
