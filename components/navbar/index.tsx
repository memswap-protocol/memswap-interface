import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Flex, Text } from '../primitives'
import ThemeSwitcher from './ThemeSwitcher'

const Navbar = () => {
  return (
    <Flex
      align="center"
      justify="between"
      css={{
        position: 'fixed',
        top: 0,
        width: '100%',
        backgroundColor: 'neutralBg',
        px: '4',
        py: '2',
        borderBottom: '1px solid',
        borderBottomColor: 'gray6',
      }}
    >
      <Text style="h3">MemSwap</Text>
      <ThemeSwitcher />
      <ConnectButton />
    </Flex>
  )
}

export default Navbar
