import { defineConfig } from '@pandacss/dev'
import { slate, violet, blue } from '@radix-ui/colors'

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  jsxFramework: 'react',

  // Where to look for your css declarations
  include: [
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],

  // Files to exclude
  exclude: [],
  conditions: {
    extend: {
      dark: '._dark &, [data-theme="_dark"] & [data-color-mode=_dark] &',
      light: '.light &',
      typeNumber: '&[type=number]',
      spinButtons: '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button',
    },
  },

  // Useful for theme customization
  theme: {
    tokens: {
      spacing: {
        1: { value: '4px' },
        2: { value: '8px' },
        3: { value: '12px' },
        4: { value: '16px' },
        5: { value: '32px' },
        6: { value: '64px' },
      },
      fonts: {
        body: { value: 'Inter, sans-serif' },
      },
      colors: {
        // Primary
        primary1: { value: blue.blue1 },
        primary2: { value: blue.blue2 },
        primary3: { value: blue.blue3 },
        primary4: { value: blue.blue4 },
        primary5: { value: blue.blue5 },
        primary6: { value: blue.blue6 },
        primary7: { value: blue.blue7 },
        primary8: { value: blue.blue8 },
        primary9: { value: blue.blue9 },
        primary10: { value: blue.blue10 },
        primary11: { value: blue.blue11 },
        primary12: { value: blue.blue12 },

        // Gray
        gray1: { value: slate.slate1 },
        gray2: { value: slate.slate2 },
        gray3: { value: slate.slate3 },
        gray4: { value: slate.slate4 },
        gray5: { value: slate.slate5 },
        gray6: { value: slate.slate6 },
        gray7: { value: slate.slate7 },
        gray8: { value: slate.slate8 },
        gray9: { value: slate.slate9 },
        gray10: { value: slate.slate10 },
        gray11: { value: slate.slate11 },
        gray12: { value: slate.slate12 },
      },
    },
    semanticTokens: {
      colors: {
        neutralBg: { value: { base: 'white', _dark: slate.slate12 } },
        neutralText: { value: { base: slate.slate12, _dark: 'white' } },
      },
    },
    extend: {
      breakpoints: {
        sm: '600px',
        md: '900px',
        lg: '1200px',
        xl: '1400px',
        bp300: '300px',
        bp400: '400px',
        bp500: '500px',
        bp600: '600px',
        bp700: '700px',
        bp800: '800px',
        bp900: '900px',
        bp1000: '1000px',
        bp1100: '1100px',
        bp1200: '1200px',
        bp1300: '1300px',
        bp1400: '1400px',
        bp1500: '1500px',
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
})