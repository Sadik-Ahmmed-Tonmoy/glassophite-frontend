import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue-primary": "#3C55A5",
        "green-primary": "#007C74",
        "green-secondary": "#00A693",
        "green-light": "#E8F8F3",
        "gray-light": "#4B5563",
      },
      container: {
        screens: {
          DEFAULT: "1440px",
        },
        center: true,
        padding: "1.2rem",
      },
      screens: {
        xs: "540px", 
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
