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
        primary: {
          DEFAULT: "#006A4E",
          50:  "#E6F4F0",
          100: "#C0E3D8",
          500: "#006A4E",
          600: "#005840",
          700: "#004532",
        },
        danger: {
          DEFAULT: "#F42A41",
          50:  "#FEE8EB",
          100: "#FDCDD3",
          500: "#F42A41",
        },
        accent: "#0066CC",
        success: "#10B981",
        warning: "#F59E0B",
        muted: "#6B7280",
        surface: "#F5F7FA",
      },
      fontFamily: {
        bangla: ["Hind Siliguri", "sans-serif"],
        sans:  ["Hind Siliguri", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
