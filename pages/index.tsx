import type { NextPage } from 'next'
import { Anchor, Box, Flex } from '../components/primitives'
import Layout from '../components/Layout'
import { Head } from '../components/Head'
import SwapWidget from '../components/swap'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Home: NextPage = () => {
  return (
    <Layout>
      <Head />
      <Flex
        align="center"
        direction="column"
        css={{
          py: 120,
          px: '2',
          gap: 56,
          width: '100%',
          bp400: { px: 24 },
          sm: { px: '6' },
          md: { py: '6' },
        }}
      >
        <SwapWidget />
        <Anchor
          href="https://docs.memswap.xyz/"
          target="_blank"
          color="gray"
          css={{ display: 'block', sm: { display: 'none' } }}
        >
          <Flex align="center" css={{ gap: '2' }}>
            Memswap Docs
            <Box css={{ color: 'primary9' }}>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} width={12} />
            </Box>
          </Flex>
        </Anchor>
      </Flex>
    </Layout>
  )
}

export default Home
