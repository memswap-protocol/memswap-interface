import { Flex } from '../primitives'
import Image from 'next/image'
import { ConnectWalletButton } from './ConnectWalletButton'

const Navbar = () => {
  return (
    <Flex
      align="center"
      justify="between"
      css={{
        mx: '2',
        lg: { mx: 'auto', width: '100%' },
        maxWidth: 1200,
        backgroundColor: 'white',
        borderRadius: 100,
        px: 24,
        py: '3',
        boxShadow: '0px 0px 50px 0px #0000001F',
      }}
    >
      <Image src="/logo.svg" alt="MemSwap" width={144} height={22} />
      <ConnectWalletButton
        css={{ fontSize: 14, fontWeight: 500, px: '3', py: '3' }}
      >
        Connect
      </ConnectWalletButton>
    </Flex>
  )
}

export default Navbar
