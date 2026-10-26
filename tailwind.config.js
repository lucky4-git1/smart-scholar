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
        obsidian: {
          950: '#09090b',
          900: '#121215',
          850: '#151518',
          800: '#18181b',
          700: '#27272a',
          600: '#3f3f46',
        },
        scholars: {
          bg: '#09090b',
          surface: '#121215',
          card: '#18181b',
          elevated: '#202024',
          border: '#27272a',
          borderHover: '#3f3f46',
          text: '#fafafa',
          textMuted: '#a1a1aa',
          accent: '#10b981', // Emerald beacon
          accentHover: '#059669',
          amber: '#f59e0b',
          ruby: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'tactile': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 1px 3px rgba(0, 0, 0, 0.4)',
        'tactile-hover': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.14), 0 4px 14px rgba(0, 0, 0, 0.5)',
        'elevated': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 12px 28px -4px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
}
