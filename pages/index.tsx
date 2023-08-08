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
        <Swap />
        <Text style="h4" css={{ textAlign: 'center', maxWidth: 500 }}>
          A permissionless, general, and transparent swap aggregator
        </Text>
      </Flex>
    </Layout>
  )
}

export default Home
