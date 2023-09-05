import { defineConfig } from '@pandacss/dev'
import {
  slate,
  crimson,
  blackA,
  red,
  green,
  blue,
  yellow,
} from '@radix-ui/colors'

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
      typeNumber: '&[type=number]',
      spinButtons: '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button',
      data_state_open: '&[data-state="open"]',
      data_state_open_child: '[data-state=open] &',
      data_state_closed: '&[data-state="closed"]',
      data_swipe_move: '&[data-swipe="move"]',
      data_swipe_cancel: '&[data-swipe="cancel"]',
      data_swipe_end: '&[data-swipe="end"]',
      data_state_checked: '&[data-state="checked"]',
    },
  },

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
        primary1: { value: crimson.crimson1 },
        primary2: { value: crimson.crimson2 },
        primary3: { value: crimson.crimson3 },
        primary4: { value: crimson.crimson4 },
        primary5: { value: crimson.crimson5 },
        primary6: { value: crimson.crimson6 },
        primary7: { value: crimson.crimson7 },
        primary8: { value: crimson.crimson8 },
        primary9: { value: crimson.crimson9 },
        primary10: { value: crimson.crimson10 },
        primary11: { value: crimson.crimson11 },
        primary12: { value: crimson.crimson12 },

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

        // BlackA
        blackA10: { value: blackA.blackA10 },

        // Blue
        blue12: { value: blue.blue12 },

        // Red
        red2: { value: red.red2 },
        red10: { value: red.red10 },
        red11: { value: red.red11 },

        // Green
        green10: { value: green.green10 },
        green11: { value: green.green11 },

        // Yellow
        yellow9: { value: yellow.yellow9 },
        yellow10: { value: yellow.yellow10 },
        yellow11: { value: yellow.yellow11 },
        yellow12: { value: yellow.yellow12 },
      },
    },
    semanticTokens: {
      colors: {
        neutralBg: { value: { base: slate.slate1 } },
        neutralText: { value: { base: slate.slate12 } },
        success: { value: { base: green.green11 } },
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
    keyframes: {
      spin: {
        '100%': {
          transform: 'rotate(360deg)',
        },
      },
      // Toast animations
      hide: {
        '0%': { opacity: 1 },
        '100%': { opacity: 0 },
      },
      slideIn: {
        from: { transform: `translateX(calc(100% + 16px))` }, // Based on ToastViewport's padding
        to: { transform: 'translateX(0)' },
      },
      swipeOut: {
        from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
        to: { transform: `translateX(calc(100% + 16px))` },
      },
      slideDown: {
        from: { height: 0 },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      slideUp: {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: 0 },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
})
