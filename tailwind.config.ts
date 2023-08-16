import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
  theme: {
    animation: {
      'bg-init': 'bg-pan 15s ease infinite, fade-in 500ms ease 1 backwards',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      keyframes: {
        'bg-pan': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0.01' },
          '1%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
}

export default config
