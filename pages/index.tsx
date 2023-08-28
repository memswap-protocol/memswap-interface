import type { NextPage } from 'next'
import { Flex } from '../components/primitives'
import Layout from '../components/Layout'
import { Head } from '../components/Head'
import Swap from '../components/swap'
import { FAQs } from '../components/faqs'
import { Marketing } from '../components/marketing-info'

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
        <Swap />
        <Marketing />
        <FAQs />
      </Flex>
    </Layout>
  )
}

export default Home
