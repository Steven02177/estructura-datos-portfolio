/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F1420',
        panel: '#161D2E',
        paper: '#DCD7C9',
        line: '#3D4759',
        slate: '#8B93A7',
        sage: '#7FB77E',
        amber: '#E8A33D',
        rose: '#D9666B',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
