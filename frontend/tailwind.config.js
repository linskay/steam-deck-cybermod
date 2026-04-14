/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#0d0d0d",
          dark: "#1a1a1b",
          cyan: "#00fbff",
          magenta: "#ff003c",
          yellow: "#fcee0a",
          red: "#ff003c",
          blue: "#0062ff",
        }
      },
      fontFamily: {
        cyber: ["Outfit", "sans-serif"],
        tech: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00fbff, 0 0 10px #00fbff',
        'neon-magenta': '0 0 5px #ff003c, 0 0 10px #ff003c',
        'neon-yellow': '0 0 5px #fcee0a, 0 0 10px #fcee0a',
      }
    },
  },
  plugins: [],
}
