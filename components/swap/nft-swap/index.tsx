import { FC, useMemo, useState } from 'react'
import { useBalance, useAccount } from 'wagmi'
import { Address, formatUnits, zeroAddress } from 'viem'
import { useDebounce } from 'use-debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons'
import { Button, Flex, Text, Input, Anchor, Box } from '../../primitives'
import { SwapModal } from '../SwapModal'
import {
  useDeepLinkParams,
  useMounted,
  useUniswapQuote,
  useSupportedNetwork,
  useNftQuote,
} from '../../../hooks'
import { formatDollar, formatNumber } from '../../../lib/utils/numbers'
import { QuoteInfo } from '../shared/QuoteInfo'
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
  tokenList: Token[]
  loadingTokenList: boolean
  defaultTokens: Token[]
  defaultCollections?: Collection[]
}

const NFTSwap: FC<NFTSwapProps> = ({
  slippagePercentage,
  deadline,
  tokenList,
  loadingTokenList,
  defaultTokens,
  defaultCollections,
}) => {
  const isMounted = useMounted()
  const { chain } = useSupportedNetwork()
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
  const [collection, setCollection] = useState<Collection | undefined>(
    defaultCollections?.[0]
  )
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
  }, [collection, chain])

  const {
    quote: amountInQuote,
    totalEstimatedFees,
    isLoading: isFetchingQuote,
    isError: isErrorFetchingQuote,
    error: nftQuoteError,
  } = useNftQuote(tokenIn, collection, Number(debouncedAmountOut))

  const amountIn = amountInQuote?.toString() || ''

  const { rawQuote: tokenInUSD } = useUniswapQuote(
    alphaRouter,
    false,
    Number(amountIn),
    0,
    tokenIn,
    USDC_TOKENS[chain.id]
  )

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
              ellipsify
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
            {tokenInUSD ? (
              <Text style="subtitle2" color="subtle">
                {formatDollar(Number(tokenInUSD))}
              </Text>
            ) : null}
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
              defaultCollections={defaultCollections}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex align="center" css={{ gap: '3', sm: { gap: '5' } }}>
        <Anchor href="" target="_blank" color="gray">
          <Flex align="center" css={{ gap: '2', whiteSpace: 'nowrap' }}>
            Swap Mode
            <Box
              css={{ color: 'primary9', _groupHover: { color: 'primary10' } }}
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Box>
          </Flex>
        </Anchor>
        <ModeToggle swapMode={swapMode} setSwapMode={setSwapMode} />
      </Flex>
      <QuoteInfo
        isBuy={true}
        protocol={Protocol.ERC721}
        tokenIn={tokenIn}
        amountIn={amountIn}
        amountOut={debouncedAmountOut}
        totalEstimatedFees={totalEstimatedFees}
        errorFetchingQuote={isErrorFetchingQuote}
        isFetchingQuote={isFetchingQuote}
        errorMessage={nftQuoteError?.response?.data?.message}
      />
      <SwapModal
        protocol={Protocol.ERC721}
        isBuy={true}
        tokenIn={tokenIn}
        tokenOut={collectionAsTokenOut}
        amountIn={amountIn}
        amountOut={debouncedAmountOut}
        referrer={deepLinkReferrer}
        slippagePercentage={slippagePercentage}
        deadline={deadline}
        swapMode={swapMode}
        tokenInBalance={tokenInBalance}
        isFetchingQuote={isFetchingQuote}
        errorFetchingQuote={isErrorFetchingQuote}
      />
    </Flex>
  )
}
export default NFTSwap
