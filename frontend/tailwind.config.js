/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        accent: '#f97316',
        muted: '#6b7280',
        background: '#0b1120',
        card: '#020617',
      },
    },
  },
  plugins: [],
}
