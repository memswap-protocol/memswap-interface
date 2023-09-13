import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useBalance, useAccount } from 'wagmi'
import { Address, formatUnits, zeroAddress } from 'viem'
import { useDebounce } from 'use-debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons'
import { Button, Flex, Text, Input, Anchor, Box } from '../../primitives'
import { SelectTokenModal } from '../shared/SelectTokenModal'
import { SwapModal } from '../SwapModal'
import {
  useDeepLinkParams,
  useMounted,
  useUniswapQuote,
  useSupportedNetwork,
} from '../../../hooks'
import { formatDollar, formatNumber } from '../../../lib/utils/numbers'
import { QuoteInfo } from '../shared/QuoteInfo'
import { USDC_TOKENS } from '../../../lib/constants/contracts'
import { Protocol, SwapMode, Token } from '../../../lib/types'
import { ModeToggle } from '../shared/ModeToggle'
import { useEthersProvider } from '../../../lib/utils/ethersAdapter'
import { AlphaRouter } from '@uniswap/smart-order-router'
import { HighFeesWarning } from './HighFeesWarning'

type TokenSwapProps = {
  slippagePercentage: string
  deadline: string
  tokenList: Token[]
  loadingTokenList: boolean
  defaultTokens: Token[]
}

const TokenSwap: FC<TokenSwapProps> = ({
  slippagePercentage,
  deadline,
  tokenList,
  loadingTokenList,
  defaultTokens,
}) => {
  const isMounted = useMounted()
  const router = useRouter()
  const { chain } = useSupportedNetwork()
  const { address } = useAccount({
    onConnect() {
      if (chain?.id !== 1) {
        setTokenIn(defaultTokens[0])
        setTokenOut(undefined)
      }
    },
    onDisconnect: () => {
      if (chain?.id !== 1) {
        setTokenIn(defaultTokens[0])
        setTokenOut(undefined)
      }
    },
  })

  const provider = useEthersProvider()

  const alphaRouter = useMemo(() => {
    return new AlphaRouter({
      chainId: chain.id,
      provider: provider,
    })
  }, [chain, provider])

  // Intent states
  const [tokenIn, setTokenIn] = useState<Token | undefined>(defaultTokens[0])
  const [tokenOut, setTokenOut] = useState<Token | undefined>()
  const [amountIn, setAmountIn] = useState('')
  const [debouncedAmountIn] = useDebounce(amountIn, 500)
  const [amountOut, setAmountOut] = useState('')
  const [debouncedAmountOut] = useDebounce(amountOut, 500)
  const [swapMode, setSwapMode] = useState<SwapMode>('Rapid')
  const [isBuy, setIsBuy] = useState(false)

  // Deep Link Query Parameters
  const {
    tokenIn: deepLinkTokenIn,
    tokenOut: deepLinkTokenOut,
    referrer: deepLinkReferrer,
  } = useDeepLinkParams(tokenList)

  useEffect(() => {
    if (deepLinkTokenIn?.address) {
      setTokenIn(deepLinkTokenIn)
    }

    if (deepLinkTokenOut?.address) {
      setTokenOut(deepLinkTokenOut)
    }
  }, [deepLinkTokenIn, deepLinkTokenOut, deepLinkReferrer])

  const {
    quote,
    isLoading: isFetchingQuote,
    isError: errorFetchingQuote,
    isHighGasFee,
    setIsAutoUpdate,
    setShouldRefresh,
  } = useUniswapQuote(
    alphaRouter,
    isBuy,
    Number(debouncedAmountIn),
    Number(debouncedAmountOut),
    tokenIn,
    tokenOut
  )

  useEffect(() => {
    if (!isFetchingQuote && !errorFetchingQuote) {
      setIsAutoUpdate(true)
      if (isBuy) {
        setAmountIn(quote ?? '')
      } else {
        setAmountOut(quote ?? '')
      }
    }
  }, [quote])

  // Refresh quote when tokenIn or tokenOut changes
  useEffect(() => {
    setShouldRefresh(true)
  }, [tokenIn, tokenOut])

  const { quote: tokenInUSD } = useUniswapQuote(
    alphaRouter,
    false,
    Number(debouncedAmountIn),
    0,
    tokenIn,
    USDC_TOKENS[chain.id]
  )

  const { quote: tokenOutUSD } = useUniswapQuote(
    alphaRouter,
    false,
    Number(debouncedAmountOut),
    0,
    tokenOut,
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

  const { data: tokenOutBalance } = useBalance({
    chainId: chain.id,
    address: tokenOut ? address : undefined,
    watch: true,
    token:
      tokenOut?.address !== zeroAddress
        ? (tokenOut?.address as Address)
        : undefined,
    enabled: Boolean(tokenOut),
  })

  const switchTokens = useCallback(() => {
    const currentTokenIn = tokenIn
    const currentTokenOut = tokenOut

    setTokenIn(currentTokenOut)
    setTokenOut(currentTokenIn)

    const updatedQuery = {
      ...router.query,
      ...(currentTokenOut?.address
        ? { from: currentTokenOut.address }
        : undefined),
      ...(currentTokenIn?.address ? { to: currentTokenIn.address } : undefined),
    }

    router.push(
      {
        pathname: router.pathname,
        query: updatedQuery,
      },
      undefined,
      {
        shallow: true,
      }
    )
  }, [tokenOut, tokenIn])

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
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              pattern="^[0-9]+(\.[0-9]*)?$"
              ellipsify
              size="large"
              css={{
                backgroundColor: 'transparent',
                borderRadius: 0,
                p: 0,
                _focus: { boxShadow: 'none', outline: 'none' },
              }}
              value={amountIn}
              onChange={(e) => {
                const inputValue = e.target.value
                const regex = /^[0-9]+(\.[0-9]*)?$/

                if (regex.test(inputValue) || inputValue === '') {
                  setIsAutoUpdate(false)
                  setAmountIn(inputValue)
                  setIsBuy(false)
                }
              }}
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
            color: 'gray9',
          }}
          onClick={switchTokens}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </Button>
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
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              pattern="^[0-9]+(\.[0-9]*)?$"
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
                const regex = /^[0-9]+(\.[0-9]*)?$/

                if (regex.test(inputValue) || inputValue === '') {
                  setIsAutoUpdate(false)
                  setAmountOut(inputValue)
                  setIsBuy(true)
                }
              }}
            />
            {tokenOutUSD ? (
              <Text style="subtitle2" color="subtle">
                {formatDollar(Number(tokenOutUSD))}
              </Text>
            ) : null}
          </Flex>

          <Flex
            direction="column"
            justify="between"
            align="end"
            css={{ gap: '2' }}
          >
            <SelectTokenModal
              tokenType="to"
              token={tokenOut}
              setToken={setTokenOut}
              tokenList={tokenList}
              loadingTokenList={loadingTokenList}
            />
            {tokenOutBalance !== undefined && isMounted ? (
              <Text style="subtitle2" color="subtle" ellipsify>
                Balance:{' '}
                {formatNumber(
                  formatUnits(
                    tokenOutBalance?.value,
                    tokenOutBalance?.decimals
                  ),
                  8
                )}
              </Text>
            ) : null}
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
        errorFetchingQuote={errorFetchingQuote}
        isFetchingQuote={isFetchingQuote}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
        amountOut={amountOut}
      />
      {isHighGasFee ? <HighFeesWarning /> : null}
      <SwapModal
        protocol={Protocol.ERC20}
        isBuy={isBuy}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
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
export default TokenSwap
