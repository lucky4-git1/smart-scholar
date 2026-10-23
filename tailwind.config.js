/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        scholars: {
          bg: '#0A0908',
          surface: '#12110F',
          card: '#191714',
          elevated: '#211E1A',
          border: '#2A2520',
          borderHover: '#3D3630',
          text: '#F5F2EB',
          textMuted: '#9E9486',
          sand: '#E3BC9A',
          sandLight: '#FFF3E6',
          sandDark: '#C49B75',
          gold: '#F4A460',
          amber: '#D2691E',
          teal: '#14B8A6',
          tealDark: '#04211D',
          tealBadge: '#052B26',
          ruby: '#EF4444',
          warning: '#F59E0B',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['"Martian Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'tactile': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 2px 4px rgba(0, 0, 0, 0.3)',
        'tactile-hover': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
