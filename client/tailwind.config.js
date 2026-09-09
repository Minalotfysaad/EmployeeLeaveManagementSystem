/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1523',
          900: '#13263D', // Primary Dark Navy Surface
          850: '#172B43',
          800: '#1B314A', // Secondary Navy / Hover
          700: '#233E5D',
          600: '#32567D',
        },
        brand: {
          teal: '#2FA7C4', // Primary Brand Accent
          cyan: '#38B7D5', // Secondary Cyan
          darkTeal: '#1F7E96',
          lightTeal: '#EBF7FA',
          orange: '#F4A340', // Secondary Orange Accent
          lightOrange: '#FFB454',
          paleOrange: '#FEF6EC',
        },
        app: {
          bg: '#F6F8FB',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          soft: '#F9FAFC',
          border: '#E5EAF0',
          borderDark: '#D5DFEA',
          text: '#1F2937',
          textMuted: '#6B7280',
          textLight: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(19, 38, 61, 0.05), 0 1px 2px -1px rgba(19, 38, 61, 0.03)',
        'card-hover': '0 4px 12px 0 rgba(19, 38, 61, 0.08)',
        'dropdown': '0 10px 25px -3px rgba(19, 38, 61, 0.12), 0 4px 6px -4px rgba(19, 38, 61, 0.07)',
        'modal': '0 20px 30px -5px rgba(19, 38, 61, 0.18), 0 8px 10px -6px rgba(19, 38, 61, 0.1)',
      }
    },
  },
  plugins: [],
}
