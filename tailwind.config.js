/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#030712',
          900: '#0A1428',
          850: '#0D1A33',
          800: '#10203F',
          700: '#16264D',
        },
        accent: {
          blue: '#3B82F6',
          cyan: '#22D3EE',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' },
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounceSlow: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
