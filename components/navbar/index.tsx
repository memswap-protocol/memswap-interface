import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Flex } from '../primitives'
import Image from 'next/image'

const Navbar = () => {
  return (
    <Flex
      align="center"
      justify="between"
      css={{
        position: 'fixed',
        top: 10,
        sm: {
          top: 56,
        },
        left: 0,
        right: 0,
        margin: 'auto',
        width: '100%',
        maxWidth: 1200,
        backgroundColor: 'white',
        borderRadius: 100,
        px: '5',
        py: '2',
        boxShadow: '0px 0px 50px 0px #0000001F',
      }}
    >
      <Image src="/logo.svg" alt="MemSwap" width={144} height={22} />
      <ConnectButton />
    </Flex>
  )
}

export default Navbar
