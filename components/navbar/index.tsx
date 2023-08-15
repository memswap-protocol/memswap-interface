import { Flex } from '../primitives'
import Image from 'next/image'
import { ConnectWalletButton } from './ConnectWalletButton'
import Link from 'next/link'

const Navbar = () => {
  return (
    <Flex
      align="center"
      justify="between"
      css={{
        '--borderColor': 'colors.gray6',
        borderBottom: '1px solid var(--borderColor)',
        sm: {
          borderRadius: 100,
          boxShadow: '0px 0px 50px 0px #0000001F',
          borderBottom: 'none',
        },
        lg: { mx: 'auto', width: '100%' },
        maxWidth: 1200,
        backgroundColor: 'white',
        px: 24,
        py: '3',
      }}
    >
      <Link href="/">
        <Image src="/logo.svg" alt="MemSwap" width={144} height={22} />
      </Link>
      <ConnectWalletButton
        css={{ fontSize: 14, fontWeight: 500, px: '3', py: '3' }}
      >
        Connect
      </ConnectWalletButton>
    </Flex>
  )
}

export default Navbar
