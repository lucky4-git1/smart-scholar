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
        pine: {
          950: '#041B17',
          900: '#072E27',
          850: '#08362E',
          800: '#0A3D36',
          750: '#0B433B',
          700: '#0C4840',
          600: '#115E53',
          500: '#177A6C',
        },
        seafoam: {
          300: '#5EEAD4',
          400: '#29D5BF',
          500: '#22D0B9',
          600: '#18BAA4',
          700: '#109C89',
        },
        parchment: {
          50: '#FFFDF9',
          100: '#FAF6EE',
          150: '#F6F0E4',
          200: '#F2E8D8',
          250: '#EADBC6',
          300: '#E3CDB4',
          400: '#D5BA9B',
        },
        apricot: {
          100: '#FDF0E4',
          200: '#FBE2CB',
          300: '#FAD4B2',
          400: '#F6AC6D',
          500: '#EF8D41',
          600: '#DE7324',
        },
        ink: {
          950: '#061714',
          900: '#0A2520',
          800: '#12332D',
          700: '#1C433C',
          600: '#2E5850',
          500: '#466F67',
        }
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Newsreader"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'paper': '0 1px 3px rgba(10, 61, 54, 0.06), 0 10px 24px -6px rgba(10, 61, 54, 0.08)',
        'paper-lg': '0 4px 6px -1px rgba(10, 61, 54, 0.06), 0 20px 32px -8px rgba(10, 61, 54, 0.12)',
        'retro': '3px 3px 0px 0px rgba(10, 61, 54, 0.8)',
        'retro-sm': '2px 2px 0px 0px rgba(10, 61, 54, 0.8)',
        'retro-teal': '3px 3px 0px 0px #22D0B9',
      }
    },
  },
  plugins: [],
}
