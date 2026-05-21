import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003087",
        "primary-dark": "#1a1a2e",
        "primary-light": "#1a4aa0",
        gold: "#FFD700",
        "live-red": "#e63946",
        surface: "#f8fafc",
        "form-win": "#2d6a4f",
        "form-draw": "#888880",
        "form-loss": "#c1440e",
      },
    },
  },
};

export default config;
