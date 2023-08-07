import type { NextPage } from 'next'
import { Flex, Text } from '../components/primitives'
import Layout from '../components/Layout'
import { Head } from '../components/Head'
import Swap from '../components/swap'

const Home: NextPage = () => {
  return (
    <Layout>
      <Head />
      <Flex
        align="center"
        direction="column"
        css={{ py: '6', px: '2', gap: '6', width: '100%', sm: { px: '6' } }}
      >
        <Text style="subtitle1" css={{ textAlign: 'center' }}>
          A Decentralized “Intents-based” Protocol for Efficient and Transparent
          Token Swaps Leveraging the Ethereum Mempool
        </Text>
        <Swap />
      </Flex>
    </Layout>
  )
}

export default Home
