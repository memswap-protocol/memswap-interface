import { styled } from '../../styled-system/jsx'

const Anchor = styled('a', {
  base: {
    width: 'max-content',
    fontWeight: 500,
    fontSize: 14,
    color: 'primary11',
    _hover: {
      color: 'primary9',
    },
  },
  variants: {
    color: {
      gray: {
        color: 'gray12',
        _hover: { color: 'gray11' },
      },
    },
    weight: {
      bold: { fontWeight: 700 },
      semi_bold: { fontWeight: 600 },
    },
  },
})

export default Anchor
