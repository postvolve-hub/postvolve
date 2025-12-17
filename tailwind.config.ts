import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'xl': '0.5rem',      // Reduced from 0.75rem
        '2xl': '0.75rem',    // Reduced from 1rem
        'lg': '0.375rem',    // Reduced from 0.5rem
      },
    },
  },
  plugins: [],
};

export default config;

