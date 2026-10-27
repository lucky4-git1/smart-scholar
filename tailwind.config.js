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
        navy: {
          950: '#070F1A',
          900: '#0B192C',
          850: '#0F223A',
          800: '#162E4D',
          750: '#1A365B',
          700: '#1E3E62',
          600: '#2A5485',
          500: '#3B6FA8',
        },
        terracotta: {
          300: '#F6A88B',
          400: '#EB8461',
          500: '#E06B43',
          600: '#C8532B',
          700: '#A73E18',
        },
        parchment: {
          50: '#FFFFFF',
          100: '#FAF7F2',
          150: '#F5EFEB',
          200: '#EEDBC7',
          250: '#E2CBB3',
          300: '#D5BA9B',
        },
        ochre: {
          100: '#FDF8EE',
          200: '#F7EDD4',
          300: '#ECD6A5',
          400: '#E3BC82',
          500: '#C8943B',
        },
        ink: {
          950: '#070F1A',
          900: '#0B192C',
          800: '#1A2E44',
          700: '#2A4462',
          600: '#3E5C80',
          500: '#5A789C',
        }
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Newsreader"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'paper': '0 1px 3px rgba(11, 25, 44, 0.05), 0 10px 24px -6px rgba(11, 25, 44, 0.07)',
        'paper-lg': '0 4px 6px -1px rgba(11, 25, 44, 0.06), 0 20px 32px -8px rgba(11, 25, 44, 0.11)',
        'retro': '3px 3px 0px 0px rgba(11, 25, 44, 0.85)',
        'retro-sm': '2px 2px 0px 0px rgba(11, 25, 44, 0.85)',
        'retro-terracotta': '3px 3px 0px 0px #E06B43',
      }
    },
  },
  plugins: [],
}
