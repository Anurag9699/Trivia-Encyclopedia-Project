import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        cinema: {
          dark: '#0a0a0f',
          card: '#111118',
          accent: '#8b5cf6',
        },
      },
      backdropBlur: {
        xl: '24px',
      },
    },
  },
  plugins: [],
};

export default config;
