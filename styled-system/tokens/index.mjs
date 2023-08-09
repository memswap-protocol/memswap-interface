const tokens = {
  "spacing.1": {
    "value": "4px",
    "variable": "var(--spacing-1)"
  },
  "spacing.2": {
    "value": "8px",
    "variable": "var(--spacing-2)"
  },
  "spacing.3": {
    "value": "12px",
    "variable": "var(--spacing-3)"
  },
  "spacing.4": {
    "value": "16px",
    "variable": "var(--spacing-4)"
  },
  "spacing.5": {
    "value": "32px",
    "variable": "var(--spacing-5)"
  },
  "spacing.6": {
    "value": "64px",
    "variable": "var(--spacing-6)"
  },
  "fonts.body": {
    "value": "Inter, sans-serif",
    "variable": "var(--fonts-body)"
  },
  "colors.primary1": {
    "value": "hsl(206, 100%, 99.2%)",
    "variable": "var(--colors-primary1)"
  },
  "colors.primary2": {
    "value": "hsl(210, 100%, 98.0%)",
    "variable": "var(--colors-primary2)"
  },
  "colors.primary3": {
    "value": "hsl(209, 100%, 96.5%)",
    "variable": "var(--colors-primary3)"
  },
  "colors.primary4": {
    "value": "hsl(210, 98.8%, 94.0%)",
    "variable": "var(--colors-primary4)"
  },
  "colors.primary5": {
    "value": "hsl(209, 95.0%, 90.1%)",
    "variable": "var(--colors-primary5)"
  },
  "colors.primary6": {
    "value": "hsl(209, 81.2%, 84.5%)",
    "variable": "var(--colors-primary6)"
  },
  "colors.primary7": {
    "value": "hsl(208, 77.5%, 76.9%)",
    "variable": "var(--colors-primary7)"
  },
  "colors.primary8": {
    "value": "hsl(206, 81.9%, 65.3%)",
    "variable": "var(--colors-primary8)"
  },
  "colors.primary9": {
    "value": "hsl(206, 100%, 50.0%)",
    "variable": "var(--colors-primary9)"
  },
  "colors.primary10": {
    "value": "hsl(208, 100%, 47.3%)",
    "variable": "var(--colors-primary10)"
  },
  "colors.primary11": {
    "value": "hsl(211, 100%, 43.2%)",
    "variable": "var(--colors-primary11)"
  },
  "colors.primary12": {
    "value": "hsl(211, 100%, 15.0%)",
    "variable": "var(--colors-primary12)"
  },
  "colors.gray1": {
    "value": "hsl(206, 30.0%, 98.8%)",
    "variable": "var(--colors-gray1)"
  },
  "colors.gray2": {
    "value": "hsl(210, 16.7%, 97.6%)",
    "variable": "var(--colors-gray2)"
  },
  "colors.gray3": {
    "value": "hsl(209, 13.3%, 95.3%)",
    "variable": "var(--colors-gray3)"
  },
  "colors.gray4": {
    "value": "hsl(209, 12.2%, 93.2%)",
    "variable": "var(--colors-gray4)"
  },
  "colors.gray5": {
    "value": "hsl(208, 11.7%, 91.1%)",
    "variable": "var(--colors-gray5)"
  },
  "colors.gray6": {
    "value": "hsl(208, 11.3%, 88.9%)",
    "variable": "var(--colors-gray6)"
  },
  "colors.gray7": {
    "value": "hsl(207, 11.1%, 85.9%)",
    "variable": "var(--colors-gray7)"
  },
  "colors.gray8": {
    "value": "hsl(205, 10.7%, 78.0%)",
    "variable": "var(--colors-gray8)"
  },
  "colors.gray9": {
    "value": "hsl(206, 6.0%, 56.1%)",
    "variable": "var(--colors-gray9)"
  },
  "colors.gray10": {
    "value": "hsl(206, 5.8%, 52.3%)",
    "variable": "var(--colors-gray10)"
  },
  "colors.gray11": {
    "value": "hsl(206, 6.0%, 43.5%)",
    "variable": "var(--colors-gray11)"
  },
  "colors.gray12": {
    "value": "hsl(206, 24.0%, 9.0%)",
    "variable": "var(--colors-gray12)"
  },
  "colors.blackA10": {
    "value": "hsla(0, 0%, 0%, 0.478)",
    "variable": "var(--colors-black-a10)"
  },
  "colors.red11": {
    "value": "hsl(358, 65.0%, 48.7%)",
    "variable": "var(--colors-red11)"
  },
  "breakpoints.2xl": {
    "value": "1536px",
    "variable": "var(--breakpoints-2xl)"
  },
  "breakpoints.sm": {
    "value": "600px",
    "variable": "var(--breakpoints-sm)"
  },
  "breakpoints.md": {
    "value": "900px",
    "variable": "var(--breakpoints-md)"
  },
  "breakpoints.lg": {
    "value": "1200px",
    "variable": "var(--breakpoints-lg)"
  },
  "breakpoints.xl": {
    "value": "1400px",
    "variable": "var(--breakpoints-xl)"
  },
  "breakpoints.bp300": {
    "value": "300px",
    "variable": "var(--breakpoints-bp300)"
  },
  "breakpoints.bp400": {
    "value": "400px",
    "variable": "var(--breakpoints-bp400)"
  },
  "breakpoints.bp500": {
    "value": "500px",
    "variable": "var(--breakpoints-bp500)"
  },
  "breakpoints.bp600": {
    "value": "600px",
    "variable": "var(--breakpoints-bp600)"
  },
  "breakpoints.bp700": {
    "value": "700px",
    "variable": "var(--breakpoints-bp700)"
  },
  "breakpoints.bp800": {
    "value": "800px",
    "variable": "var(--breakpoints-bp800)"
  },
  "breakpoints.bp900": {
    "value": "900px",
    "variable": "var(--breakpoints-bp900)"
  },
  "breakpoints.bp1000": {
    "value": "1000px",
    "variable": "var(--breakpoints-bp1000)"
  },
  "breakpoints.bp1100": {
    "value": "1100px",
    "variable": "var(--breakpoints-bp1100)"
  },
  "breakpoints.bp1200": {
    "value": "1200px",
    "variable": "var(--breakpoints-bp1200)"
  },
  "breakpoints.bp1300": {
    "value": "1300px",
    "variable": "var(--breakpoints-bp1300)"
  },
  "breakpoints.bp1400": {
    "value": "1400px",
    "variable": "var(--breakpoints-bp1400)"
  },
  "breakpoints.bp1500": {
    "value": "1500px",
    "variable": "var(--breakpoints-bp1500)"
  },
  "sizes.breakpoint-2xl": {
    "value": "1536px",
    "variable": "var(--sizes-breakpoint-2xl)"
  },
  "sizes.breakpoint-sm": {
    "value": "600px",
    "variable": "var(--sizes-breakpoint-sm)"
  },
  "sizes.breakpoint-md": {
    "value": "900px",
    "variable": "var(--sizes-breakpoint-md)"
  },
  "sizes.breakpoint-lg": {
    "value": "1200px",
    "variable": "var(--sizes-breakpoint-lg)"
  },
  "sizes.breakpoint-xl": {
    "value": "1400px",
    "variable": "var(--sizes-breakpoint-xl)"
  },
  "sizes.breakpoint-bp300": {
    "value": "300px",
    "variable": "var(--sizes-breakpoint-bp300)"
  },
  "sizes.breakpoint-bp400": {
    "value": "400px",
    "variable": "var(--sizes-breakpoint-bp400)"
  },
  "sizes.breakpoint-bp500": {
    "value": "500px",
    "variable": "var(--sizes-breakpoint-bp500)"
  },
  "sizes.breakpoint-bp600": {
    "value": "600px",
    "variable": "var(--sizes-breakpoint-bp600)"
  },
  "sizes.breakpoint-bp700": {
    "value": "700px",
    "variable": "var(--sizes-breakpoint-bp700)"
  },
  "sizes.breakpoint-bp800": {
    "value": "800px",
    "variable": "var(--sizes-breakpoint-bp800)"
  },
  "sizes.breakpoint-bp900": {
    "value": "900px",
    "variable": "var(--sizes-breakpoint-bp900)"
  },
  "sizes.breakpoint-bp1000": {
    "value": "1000px",
    "variable": "var(--sizes-breakpoint-bp1000)"
  },
  "sizes.breakpoint-bp1100": {
    "value": "1100px",
    "variable": "var(--sizes-breakpoint-bp1100)"
  },
  "sizes.breakpoint-bp1200": {
    "value": "1200px",
    "variable": "var(--sizes-breakpoint-bp1200)"
  },
  "sizes.breakpoint-bp1300": {
    "value": "1300px",
    "variable": "var(--sizes-breakpoint-bp1300)"
  },
  "sizes.breakpoint-bp1400": {
    "value": "1400px",
    "variable": "var(--sizes-breakpoint-bp1400)"
  },
  "sizes.breakpoint-bp1500": {
    "value": "1500px",
    "variable": "var(--sizes-breakpoint-bp1500)"
  },
  "colors.neutralBg": {
    "value": "var(--colors-neutral-bg)",
    "variable": "var(--colors-neutral-bg)"
  },
  "colors.neutralText": {
    "value": "var(--colors-neutral-text)",
    "variable": "var(--colors-neutral-text)"
  },
  "spacing.-1": {
    "value": "calc(var(--spacing-1) * -1)",
    "variable": "var(--spacing-1)"
  },
  "spacing.-2": {
    "value": "calc(var(--spacing-2) * -1)",
    "variable": "var(--spacing-2)"
  },
  "spacing.-3": {
    "value": "calc(var(--spacing-3) * -1)",
    "variable": "var(--spacing-3)"
  },
  "spacing.-4": {
    "value": "calc(var(--spacing-4) * -1)",
    "variable": "var(--spacing-4)"
  },
  "spacing.-5": {
    "value": "calc(var(--spacing-5) * -1)",
    "variable": "var(--spacing-5)"
  },
  "spacing.-6": {
    "value": "calc(var(--spacing-6) * -1)",
    "variable": "var(--spacing-6)"
  }
}

export function token(path, fallback) {
  return tokens[path]?.value || fallback
}

function tokenVar(path, fallback) {
  return tokens[path]?.variable || fallback
}

token.var = tokenVar