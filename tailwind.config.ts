import type { Config } from 'tailwindcss'
import { createThemes } from 'tw-colors'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--inter)'],
    },
    fontSize: {
      xs: '.625rem',
      sm: '.75rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '3rem',
    },
    extend: {
      backgroundImage: {
        auth: "url('/auth.svg')",
      },
    },
  },
  plugins: [
    createThemes({
      light: {
        sky: '#1371f1',
        pure: '#ffffff',
        verdant: '#1d864c',
        scarlet: '#e32b2b',
        slate: '#828282',
        mist: '#f4f4f4',
        ashen: '#6e6e6e',
        foggy: '#f2f2f2',
        charcoal: '#2e2e2e',
      },
      dark: {
        sky: '#5096f1',
        pure: '#192734',
        verdant: '#27ae60',
        scarlet: '#ec6060',
        slate: '#828282',
        mist: '#333333',
        ashen: '#8899a6',
        foggy: '#22303c',
        charcoal: '#ffffff',
      },
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
export default config
