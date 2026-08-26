/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dedsec-bg': '#050a0f',
        'dedsec-green': '#82ff00',
        'dedsec-blue': '#00bfff',
        'dedsec-card': '#0a1520',
      },
      fontFamily: {
        orbitron: ['Audiowide', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00bfff, inset 0 0 5px #00bfff',
        'neon-green': '0 0 5px #82ff00, inset 0 0 5px #82ff00',
      }
    },
  },
  plugins: [],
}