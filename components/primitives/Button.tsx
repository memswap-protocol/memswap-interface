import { styled } from '../../styled-system/jsx'

const Button = styled('button', {
  base: {
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'body',
    fontWeight: 700,
    fontSize: 16,
    transition: 'background-color 250ms linear',
    gap: '2',
    display: 'inline-flex',
    alignItems: 'center',
    lineHeight: '20px',
    _disabled: {
      backgroundColor: 'gray8',
      color: 'gray11',
      _hover: {
        backgroundColor: 'gray8',
        color: 'gray11',
      },
    },
  },
  variants: {
    color: {
      primary: {
        backgroundColor: 'primary9',
        color: 'white',
        '&:hover': {
          backgroundColor: 'primary10',
        },
      },
      secondary: {
        backgroundColor: 'secondary4',
        color: 'primary12',
        '&:hover': {
          backgroundColor: 'secondary5',
        },
      },
      gray3: {
        backgroundColor: 'gray3',
        color: 'gray12',
        '&:hover': {
          backgroundColor: 'gray4',
        },
      },
      gray4: {
        backgroundColor: 'gray4',
        color: 'gray12',
        '&:hover': {
          backgroundColor: 'gray5',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        p: 0,
      },
    },
    corners: {
      square: {
        borderRadius: 0,
      },
      rounded: {
        borderRadius: 8,
      },
      pill: {
        borderRadius: 99999,
      },
      circle: {
        borderRadius: '99999px',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    size: {
      none: {},
      xs: {
        p: '3',
        lineHeight: '16px',
        minHeight: 40,
      },
      small: {
        px: '3',
        py: '4',
        lineHeight: '12px',
        minHeight: 44,
      },
      medium: {
        px: '5',
        py: '3',
        minHeight: 44,
      },
      large: {
        px: '5',
        py: '4',
        minHeight: 52,
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    corners: 'rounded',
    size: 'medium',
  },
})

export default Button
