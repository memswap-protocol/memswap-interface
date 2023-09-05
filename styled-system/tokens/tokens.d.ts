/* eslint-disable */
export type Token = "spacing.1" | "spacing.2" | "spacing.3" | "spacing.4" | "spacing.5" | "spacing.6" | "fonts.body" | "colors.primary1" | "colors.primary2" | "colors.primary3" | "colors.primary4" | "colors.primary5" | "colors.primary6" | "colors.primary7" | "colors.primary8" | "colors.primary9" | "colors.primary10" | "colors.primary11" | "colors.primary12" | "colors.gray1" | "colors.gray2" | "colors.gray3" | "colors.gray4" | "colors.gray5" | "colors.gray6" | "colors.gray7" | "colors.gray8" | "colors.gray9" | "colors.gray10" | "colors.gray11" | "colors.gray12" | "colors.blackA10" | "colors.blue12" | "colors.red2" | "colors.red10" | "colors.red11" | "colors.green10" | "colors.green11" | "colors.yellow9" | "colors.yellow10" | "colors.yellow11" | "colors.yellow12" | "breakpoints.2xl" | "breakpoints.sm" | "breakpoints.md" | "breakpoints.lg" | "breakpoints.xl" | "breakpoints.bp300" | "breakpoints.bp400" | "breakpoints.bp500" | "breakpoints.bp600" | "breakpoints.bp700" | "breakpoints.bp800" | "breakpoints.bp900" | "breakpoints.bp1000" | "breakpoints.bp1100" | "breakpoints.bp1200" | "breakpoints.bp1300" | "breakpoints.bp1400" | "breakpoints.bp1500" | "sizes.breakpoint-2xl" | "sizes.breakpoint-sm" | "sizes.breakpoint-md" | "sizes.breakpoint-lg" | "sizes.breakpoint-xl" | "sizes.breakpoint-bp300" | "sizes.breakpoint-bp400" | "sizes.breakpoint-bp500" | "sizes.breakpoint-bp600" | "sizes.breakpoint-bp700" | "sizes.breakpoint-bp800" | "sizes.breakpoint-bp900" | "sizes.breakpoint-bp1000" | "sizes.breakpoint-bp1100" | "sizes.breakpoint-bp1200" | "sizes.breakpoint-bp1300" | "sizes.breakpoint-bp1400" | "sizes.breakpoint-bp1500" | "colors.neutralBg" | "colors.neutralText" | "colors.success" | "spacing.-1" | "spacing.-2" | "spacing.-3" | "spacing.-4" | "spacing.-5" | "spacing.-6"

export type SpacingToken = "1" | "2" | "3" | "4" | "5" | "6" | "-1" | "-2" | "-3" | "-4" | "-5" | "-6"

export type FontToken = "body"

export type ColorToken = "primary1" | "primary2" | "primary3" | "primary4" | "primary5" | "primary6" | "primary7" | "primary8" | "primary9" | "primary10" | "primary11" | "primary12" | "gray1" | "gray2" | "gray3" | "gray4" | "gray5" | "gray6" | "gray7" | "gray8" | "gray9" | "gray10" | "gray11" | "gray12" | "blackA10" | "blue12" | "red2" | "red10" | "red11" | "green10" | "green11" | "yellow9" | "yellow10" | "yellow11" | "yellow12" | "neutralBg" | "neutralText" | "success"

export type BreakpointToken = "2xl" | "sm" | "md" | "lg" | "xl" | "bp300" | "bp400" | "bp500" | "bp600" | "bp700" | "bp800" | "bp900" | "bp1000" | "bp1100" | "bp1200" | "bp1300" | "bp1400" | "bp1500"

export type SizeToken = "breakpoint-2xl" | "breakpoint-sm" | "breakpoint-md" | "breakpoint-lg" | "breakpoint-xl" | "breakpoint-bp300" | "breakpoint-bp400" | "breakpoint-bp500" | "breakpoint-bp600" | "breakpoint-bp700" | "breakpoint-bp800" | "breakpoint-bp900" | "breakpoint-bp1000" | "breakpoint-bp1100" | "breakpoint-bp1200" | "breakpoint-bp1300" | "breakpoint-bp1400" | "breakpoint-bp1500"

export type Tokens = {
		spacing: SpacingToken
		fonts: FontToken
		colors: ColorToken
		breakpoints: BreakpointToken
		sizes: SizeToken
} & { [token: string]: never }

export type TokenCategory = "zIndex" | "opacity" | "colors" | "fonts" | "fontSizes" | "fontWeights" | "lineHeights" | "letterSpacings" | "sizes" | "shadows" | "spacing" | "radii" | "borders" | "durations" | "easings" | "animations" | "blurs" | "gradients" | "breakpoints" | "assets"