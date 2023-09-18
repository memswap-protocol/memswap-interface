import { Anchor, Flex, Box, Text } from '../primitives'
import Image from 'next/image'
import { ConnectWalletButton } from './ConnectWalletButton'
import Link from 'next/link'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMediaQuery } from 'usehooks-ts'

const Navbar = () => {
  const isSmallDevice = useMediaQuery('(max-width: 600px)')
  return (
    <Flex
      align="center"
      justify="between"
      css={{
        position: 'fixed',
        width: '100%',
        maxWidth: 1200,
        px: 24,
        py: '3',
        zIndex: 9999,
        backgroundColor: 'white',
        '--borderColor': 'colors.gray6',
        borderBottom: '1px solid var(--borderColor)',
        md: {
          position: 'relative',
          borderRadius: 100,
          boxShadow: '0px 0px 50px 0px #0000001F',
          borderBottom: 'none',
        },
        lg: { mx: 'auto', width: '100%' },
        gap: '3',
      }}
    >
      <Flex align="center" css={{ gap: '5' }}>
        <Flex align="center" css={{ gap: '2' }}>
          <Link href="/">
            {isSmallDevice ? (
              <Image
                src="/mobile-logo.svg"
                alt="MemSwap"
                width={50}
                height={31}
              />
            ) : (
              <Image src="/logo.svg" alt="MemSwap" width={144} height={22} />
            )}
          </Link>
          {!isSmallDevice ? (
            <Text
              style="subtitle3"
              css={{
                backgroundColor: 'primary9',
                color: 'white',
                py: '1',
                px: '2',
                borderRadius: 100,
              }}
            >
              ALPHA
            </Text>
          ) : null}
        </Flex>
        {!isSmallDevice ? (
          <Flex align="center" css={{ gap: '5' }}>
            <Anchor href="/" color="gray">
              Swap
            </Anchor>
            <Anchor href="/history" color="gray">
              History
            </Anchor>
            <Anchor
              href="https://docs.memswap.xyz/"
              target="_blank"
              color="gray"
            >
              <Flex align="center" css={{ gap: '2' }}>
                Docs
                <Box css={{ color: 'gray11' }}>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </Box>
              </Flex>
            </Anchor>
          </Flex>
        ) : null}
      </Flex>
      <Flex align="center" css={{ gap: '3', md: { gap: '5' } }}>
        {isSmallDevice ? (
          <Anchor href="/history" color="gray">
            History
          </Anchor>
        ) : null}
        <ConnectWalletButton
          css={{ fontSize: 14, fontWeight: 500, px: '3', py: '3' }}
        >
          Connect
        </ConnectWalletButton>
      </Flex>
    </Flex>
  )
}

export default Navbar
