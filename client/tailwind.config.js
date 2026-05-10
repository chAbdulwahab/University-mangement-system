/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        text: "var(--text)",
        accent: "var(--accent)",
        primary: "var(--primary)",
        highlight: "var(--highlight)",
        card: "var(--card-bg)",
        border: "var(--border)",
        sidebar: "var(--sidebar)",
        overlay: "var(--modal-overlay)",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
