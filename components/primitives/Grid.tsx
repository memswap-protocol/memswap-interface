import { styled } from '../../styled-system/jsx'

const Grid = styled('div', {
  base: {
    display: 'grid',
    gap: 0,
  },
})

const GridItem = styled('div', {
  base: {
    width: '100%',
    py: '4',
    px: 24,
    overflow: 'hidden',
  },
})

export { Grid, GridItem }
