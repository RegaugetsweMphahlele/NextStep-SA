/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172b32',
        muted: '#687a7c',
        canvas: '#f8f7f3',
        forest: '#1e5146',
        lime: '#d5ef82',
        coral: '#f3785f',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 55px rgba(28, 53, 48, 0.09)',
      },
    },
  },
  plugins: [],
}
