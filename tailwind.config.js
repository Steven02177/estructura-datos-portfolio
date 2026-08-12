/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A0F1E',
        panel: '#0F1729',
        panel2: '#141F38',
        line: '#233047',
        paper: '#F8FAFC',
        slate: '#94A3B8',
        blue: '#2563EB',
        blueLight: '#3B82F6',
        cyan: '#22D3EE',
        rose: '#F87171',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
