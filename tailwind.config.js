/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        slate: {
          200: "#e2e8f0",
          300: "#cbd5f5",
          400: "#94a3b8",
          500: "#64748b",
          900: "#0f172a",
          950: "#020617",
        },
        cyan: {
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
        },
        gray: {
          700: "#374151",
        },
      },
    },
  },
  plugins: [],
}
