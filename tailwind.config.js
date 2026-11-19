/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          dark: '#171717',
          charcoal: '#222222',
          grey: '#333333',
          lightgrey: '#E5E5E5',
          border: '#E8E8E8',
          surface: '#F7F7F7',
          cream: '#FAF8F5',
          gold: '#C5A880',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
      }
    },
  },
  plugins: [],
};
