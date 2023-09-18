import { useState } from 'react'
import { Flex } from '../primitives'
import { TabsList, TabsTrigger, TabsContent } from '../primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import { SettingsDropdown } from './settings/SettingsDropdown'
import TokenSwap from './token-swap'
import NFTSwap from './nft-swap'
import { chainDefaultTokens } from '../../lib/constants/chainDefaultTokens'
import { useSupportedNetwork, useTokenList } from '../../hooks'
import useDefaultCollections from '../../hooks/useDefaultCollections'
import { SwapMode } from '../../lib/types'

const SwapWidget = () => {
  // Global configuration
  const { chain } = useSupportedNetwork()
  const defaultTokens = chainDefaultTokens[chain.id]
  const defaultCollections = useDefaultCollections()
  const { tokens: tokenList, loading: loadingTokenList } = useTokenList()

  // Global states
  const [tabValue, setTabValue] = useState('tokens')
  const [slippagePercentage, setSlippagePercentage] = useState('0.5') // default 0.5%
  const [deadline, setDeadline] = useState('5') // default 5 mins
  const [swapMode, setSwapMode] = useState<SwapMode>('Best')

  return (
    <Flex
      direction="column"
      css={{
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0px 0px 50px 0px #0000001F',
        borderRadius: 16,
        p: '4',
        gap: '3',
        maxWidth: 540,
      }}
    >
      <Tabs.Root value={tabValue} onValueChange={(value) => setTabValue(value)}>
        <Flex justify="between" align="center" css={{ gap: '4', mb: '3' }}>
          <TabsList>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>
          <SettingsDropdown
            slippagePercentage={slippagePercentage}
            setSlippagePercentage={setSlippagePercentage}
            deadline={deadline}
            setDeadline={setDeadline}
            swapMode={swapMode}
            setSwapMode={setSwapMode}
          />
        </Flex>
        <TabsContent value="tokens">
          <TokenSwap
            slippagePercentage={slippagePercentage}
            deadline={deadline}
            swapMode={swapMode}
            tokenList={tokenList}
            loadingTokenList={loadingTokenList}
            defaultTokens={defaultTokens}
          />
        </TabsContent>
        <TabsContent value="nfts">
          <NFTSwap
            slippagePercentage={slippagePercentage}
            deadline={deadline}
            swapMode={swapMode}
            tokenList={tokenList}
            loadingTokenList={loadingTokenList}
            defaultTokens={defaultTokens}
            defaultCollections={defaultCollections}
          />
        </TabsContent>
      </Tabs.Root>
    </Flex>
  )
}
export default SwapWidget
