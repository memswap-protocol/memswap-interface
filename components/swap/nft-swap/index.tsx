import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useBalance, useAccount } from 'wagmi'
import { Address, formatUnits, zeroAddress } from 'viem'
import { useDebounce } from 'use-debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Button, Flex, Text, Input } from '../../primitives'
import { SwapModal } from '../SwapModal'
import {
  useDeepLinkParams,
  useMounted,
  useTokenList,
  useUniswapQuote,
  useSupportedNetwork,
  useNftQuote,
} from '../../../hooks'
import { formatDollar, formatNumber } from '../../../lib/utils/numbers'
import { QuoteInfo } from '../shared/QuoteInfo'
import { chainDefaultTokens } from '../../../lib/constants/chainDefaultTokens'
import { USDC_TOKENS } from '../../../lib/constants/contracts'
import { Collection, Protocol, SwapMode, Token } from '../../../lib/types'
import { ModeToggle } from '../shared/ModeToggle'
import { useEthersProvider } from '../../../lib/utils/ethersAdapter'
import { AlphaRouter } from '@uniswap/smart-order-router'
import { SelectCollectionModal } from './SelectCollectionModal'
import { SelectTokenModal } from '../shared/SelectTokenModal'
import Tooltip from '../../primitives/Tooltip'

type NFTSwapProps = {
  slippagePercentage: string
  deadline: string
}

const NFTSwap: FC<NFTSwapProps> = ({ slippagePercentage, deadline }) => {
  const isMounted = useMounted()
  const { chain } = useSupportedNetwork()
  const defaultTokens = chainDefaultTokens[chain.id]
  const { tokens: tokenList, loading: loadingTokenList } = useTokenList()
  const { address } = useAccount()

  const provider = useEthersProvider()

  const alphaRouter = useMemo(() => {
    return new AlphaRouter({
      chainId: chain.id,
      provider: provider,
    })
  }, [chain, provider])

  // Intent states
  const [tokenIn, setTokenIn] = useState<Token | undefined>(defaultTokens[0])
  const [collection, setCollection] = useState<Collection | undefined>()
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('1')
  const [debouncedAmountOut] = useDebounce(amountOut, 500)
  const [swapMode, setSwapMode] = useState<SwapMode>('Rapid')

  // Deep Link Query Parameters
  const { referrer: deepLinkReferrer } = useDeepLinkParams(tokenList)

  const collectionAsTokenOut: Token | undefined = useMemo(() => {
    if (collection) {
      return {
        chainId: chain.id,
        address: collection?.id! as Address,
        name: collection?.name!,
        symbol: collection?.name!,
        decimals: 0,
        logoURI: collection?.image!,
      }
    }
  }, [collection])

  const {
    quote: amountInQuote,
    isLoading: isFetchingQuote,
    isError: errorFetchingQuote,
  } = useNftQuote(tokenIn, collection, Number(amountOut))

  // const { quote: tokenInUSD } = useUniswapQuote(
  //   alphaRouter,
  //   Number(amountIn),
  //   tokenIn,
  //   USDC_TOKENS[chain.id]
  // )

  const { data: tokenInBalance } = useBalance({
    chainId: chain.id,
    address: tokenIn ? address : undefined,
    watch: true,
    token:
      tokenIn?.address !== zeroAddress
        ? (tokenIn?.address as Address)
        : undefined,
    enabled: Boolean(tokenIn),
  })

  return (
    <Flex
      direction="column"
      css={{
        width: '100%',
        backgroundColor: 'white',
        gap: '3',
      }}
    >
      <Flex
        direction="column"
        css={{
          position: 'relative',
          backgroundColor: 'gray2',
          borderRadius: 12,
          px: '3',
          pt: '3',
          pb: '5',
          sm: { p: '5' },
        }}
      >
        <Text style="subtitle2" color="subtle">
          Pay
        </Text>
        <Flex
          align="start"
          justify="between"
          css={{
            gap: '4',
          }}
        >
          <Flex direction="column" css={{ gap: '2' }}>
            <Input
              type="text"
              placeholder="0"
              disabled={true}
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              pattern="^[0-9]*[.]?[0-9]*$"
              size="large"
              css={{
                backgroundColor: 'transparent',
                borderRadius: 0,
                p: 0,
                _focus: { boxShadow: 'none', outline: 'none' },
              }}
              value={amountInQuote}
            />
            {/* {tokenInUSD ? (
              <Text style="subtitle2" color="subtle">
                {formatDollar(Number(tokenInUSD))}
              </Text>
            ) : null} */}
          </Flex>
          <Flex direction="column" align="end" css={{ gap: '2' }}>
            <SelectTokenModal
              tokenType="from"
              token={tokenIn}
              setToken={setTokenIn}
              tokenList={tokenList}
              loadingTokenList={loadingTokenList}
            />
            {tokenInBalance !== undefined && isMounted ? (
              <Text style="subtitle2" color="subtle" ellipsify>
                Balance:{' '}
                {formatNumber(
                  formatUnits(tokenInBalance?.value, tokenInBalance?.decimals),
                  8
                )}
              </Text>
            ) : null}
          </Flex>
        </Flex>
        <Tooltip
          content={
            <Text
              color="subtle"
              style="body3"
              css={{ display: 'inline-block' }}
            >
              Selling nfts is not currently supported in the ui
            </Text>
          }
        >
          <Button
            size="xs"
            color="white"
            corners="circle"
            css={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -24,
              margin: 'auto',
              maxWidth: 'max-content',
              height: 40,
              width: 40,
              zIndex: 2,
              color: 'gray8',
              backgroundColor: 'gray2',
            }}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </Button>
        </Tooltip>
      </Flex>
      <Flex
        direction="column"
        css={{
          position: 'relative',
          backgroundColor: 'gray2',
          borderRadius: 12,
          px: '3',
          pt: '3',
          pb: '5',
          sm: { p: '5' },
        }}
      >
        <Text style="subtitle2" color="subtle">
          Receive
        </Text>
        <Flex align="start" justify="between" css={{ gap: '4' }}>
          <Flex direction="column" align="start" css={{ gap: '2' }}>
            <Input
              type="text"
              placeholder="0"
              size="large"
              ellipsify
              css={{
                backgroundColor: 'transparent',
                borderRadius: 0,
                p: 0,
                _focus: { boxShadow: 'none', outline: 'none' },
              }}
              value={amountOut}
              onChange={(e) => {
                const inputValue = e.target.value
                const regex = /^[1-9]\d*$/
                if (regex.test(inputValue) || inputValue === '') {
                  setAmountOut(inputValue)
                }
              }}
            />
          </Flex>

          <Flex
            direction="column"
            justify="between"
            align="end"
            css={{ gap: '2' }}
          >
            <SelectCollectionModal
              tokenIn={tokenIn}
              collection={collection}
              setCollection={setCollection}
            />
          </Flex>
        </Flex>
      </Flex>
      <QuoteInfo
        errorFetchingQuote={errorFetchingQuote}
        isFetchingQuote={isFetchingQuote}
        tokenIn={tokenIn}
        tokenOut={collection}
        amountIn={amountInQuote?.toString() || ''}
        amountOut={amountOut}
      />
      {/* @TODO: fix prop types */}
      <ModeToggle swapMode={swapMode} setSwapMode={setSwapMode} />
      <SwapModal
        protocol={Protocol.ERC721}
        isBuy={true}
        tokenIn={tokenIn}
        tokenOut={collectionAsTokenOut}
        amountIn={amountInQuote?.toString() || ''}
        amountOut={amountOut}
        referrer={deepLinkReferrer}
        slippagePercentage={slippagePercentage}
        deadline={deadline}
        swapMode={swapMode}
        tokenInBalance={tokenInBalance}
        isFetchingQuote={isFetchingQuote}
        errorFetchingQuote={errorFetchingQuote}
      />
    </Flex>
  )
}
export default NFTSwap
