/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'], // wait, SKILL.md said NEVER converge on common choices like Space Grotesk. I should use something else!
        // Let's use 'Playfair Display' for Editorial or 'Clash Display' / 'Syne' / 'Bebas Neue' for bold industrial. 
        // We can import them from Google Fonts. Let's use "Syne" for display and "JetBrains Mono" for body to give it a raw/industrial editorial feel.
        syne: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          dark: '#0a0a0a',
          light: '#f4f4f0',
          accent: '#ff3300', // Stark neon orange
          muted: '#888888'
        }
      }
    },
  },
  plugins: [],
}
