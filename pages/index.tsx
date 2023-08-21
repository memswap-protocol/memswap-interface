import type { NextPage } from 'next'
import { Flex, Anchor, Button } from '../components/primitives'
import Layout from '../components/Layout'
import { Head } from '../components/Head'
import Swap from '../components/swap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

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
        <Button onClick={() => methodDoesNotExist()}>Test</Button>

        {/* @TODO: add links */}
        <Flex align="center" direction="column" css={{ gap: 24 }}>
          <Anchor
            href=""
            target="_blank"
            weight="bold"
            css={{ display: 'block', md: { display: 'none' } }}
          >
            <Flex align="center" css={{ gap: '2' }}>
              Docs <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Flex>
          </Anchor>
          <Anchor
            href=""
            target="_blank"
            weight="bold"
            css={{ display: 'block', md: { display: 'none' } }}
          >
            <Flex align="center" css={{ gap: '2' }}>
              Light Paper <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Flex>
          </Anchor>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Home
