import { Box, Flex } from '../components/primitives'
import { FC, ReactNode } from 'react'
import Navbar from './navbar'

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Box
        css={{
          background: 'neutralBg',
          height: '100%',
          width: '100%',
          minHeight: '100vh',
          pt: 20,
          sm: { pt: 56 },
        }}
      >
        <Flex
          direction="column"
          css={{
            width: '100%',
            sm: { maxWidth: 1920 },
            mx: 'auto',
          }}
        >
          <Navbar />
          <main>{children}</main>
        </Flex>
      </Box>
    </>
  )
}

export default Layout
