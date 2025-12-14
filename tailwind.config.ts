import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Off-white palette
        "off-white": {
          DEFAULT: "#FAFAF9",
          light: "#F5F5F4",
        },
        // Charcoal palette
        charcoal: {
          DEFAULT: "#1C1C1E",
          light: "#2C2C2E",
        },
        // Deep green palette
        "deep-green": {
          DEFAULT: "#166534",
          light: "#15803D",
        },
        // Warm earthy palette
        "warm-earth": {
          DEFAULT: "#A16207",
          light: "#D97706",
        },
      },
    },
  },
  plugins: [],
};

export default config;

