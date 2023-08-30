import { Anchor, Flex, Box, Switch, Text } from '../primitives'
import Image from 'next/image'
import { ConnectWalletButton } from './ConnectWalletButton'
import Link from 'next/link'
import {
  faArrowUpRightFromSquare,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppMode } from '../providers/AppModeProvider'
import Tooltip from '../primitives/Tooltip'

const Navbar = () => {
  // @TODO: temporarily putting the app mode toggle in the navbar
  // Need to talk to team to decide where it should go

  const { dAppModeEnabled, toggleDAppMode } = useAppMode()
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
      }}
    >
      <Flex align="center" css={{ gap: '5' }}>
        <Link href="/">
          <Image src="/logo.svg" alt="MemSwap" width={144} height={22} />
        </Link>
        {/* @TODO: add links */}
        <Anchor
          href=""
          target="_blank"
          color="gray"
          css={{ display: 'none', md: { display: 'block' } }}
        >
          <Flex align="center" css={{ gap: '2' }}>
            Docs
            <Box css={{ color: 'gray11' }}>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Box>
          </Flex>
        </Anchor>
      </Flex>
      <Flex align="center" css={{ gap: '2' }}>
        <Flex align="start" css={{ gap: '1' }}>
          <Text style="subtitle1" color="subtle">
            dApp Mode
          </Text>
          <Tooltip
            sideOffset={10}
            content={
              <Text
                style="body2"
                css={{ display: 'inline-block', maxWidth: 250 }}
              >
                {
                  'When disabled, only public RPC urls will be used and error tracking will be disabled.'
                }
              </Text>
            }
          >
            <Flex css={{ color: 'primary11', height: 12 }}>
              <FontAwesomeIcon icon={faInfoCircle} width={12} height={12} />
            </Flex>
          </Tooltip>
        </Flex>
        <Switch
          checked={dAppModeEnabled}
          onCheckedChange={(checked) => {
            toggleDAppMode()
          }}
        />
      </Flex>

      <ConnectWalletButton
        css={{ fontSize: 14, fontWeight: 500, px: '3', py: '3' }}
      >
        Connect
      </ConnectWalletButton>
    </Flex>
  )
}

export default Navbar
