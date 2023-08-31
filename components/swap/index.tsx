import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useBalance, useAccount, useNetwork } from 'wagmi'
import { Address, formatUnits, zeroAddress } from 'viem'
import { useDebounce } from 'use-debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Button, Flex, Text, Input } from '../primitives'
import { SelectTokenModal } from './SelectTokenModal'
import { SwapModal } from './SwapModal'
import {
  useDeepLinkParams,
  useMounted,
  useTokenList,
  useQuote,
} from '../../hooks'
import { formatDollar, formatNumber } from '../../utils/numbers'
import { QuoteInfo } from './QuoteInfo'
import { chainDefaultTokens } from '../../constants/chainDefaultTokens'
import { MATCHMAKER, USDC_TOKENS } from '../../constants/contracts'
import { SwapMode, Token } from '../../types'
import { ModeToggle } from './ModeToggle'
import { SettingsDropdown } from './settings/SettingsDropdown'
import { useEthersProvider } from '../../utils/ethersAdapter'
import { AlphaRouter } from '@uniswap/smart-order-router'

const Swap = () => {
  const isMounted = useMounted()
  const router = useRouter()
  const { chain } = useNetwork()
  const defaultTokens = chainDefaultTokens[chain?.id === 5 ? 5 : 1]
  const { tokens: tokenList, loading: loadingTokenList } = useTokenList()
  const { address, isConnected } = useAccount({
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
      chainId: chain?.id || 1,
      provider: provider,
    })
  }, [chain, provider])

  // Intent states
  const [tokenIn, setTokenIn] = useState<Token | undefined>(defaultTokens[0])
  const [tokenOut, setTokenOut] = useState<Token | undefined>()
  const [amountIn, setAmountIn] = useState('')
  const [debouncedAmountIn] = useDebounce(amountIn, 500)
  const [amountOut, setAmountOut] = useState('')
  const [slippagePercentage, setSlippagePercentage] = useState('0.5') // default 0.5%
  const [deadline, setDeadline] = useState('5') // default 5 mins
  const [matchmaker, setMatchmaker] = useState<Address>(
    MATCHMAKER[chain?.id || 1]
  )
  const [swapMode, setSwapMode] = useState<SwapMode>('Rapid')

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
  } = useQuote(alphaRouter, Number(debouncedAmountIn), tokenIn, tokenOut)

  const { quote: tokenInUSD } = useQuote(
    alphaRouter,
    Number(debouncedAmountIn),
    tokenIn,
    USDC_TOKENS[chain?.id || 1]
  )

  const { quote: tokenOutUSD } = useQuote(
    alphaRouter,
    Number(amountOut),
    tokenOut,
    USDC_TOKENS[chain?.id || 1]
  )

  useEffect(() => {
    setAmountOut(quote ?? '')
  }, [quote])

  const { data: tokenInBalance } = useBalance({
    chainId: chain?.id || 1,
    address: address,
    watch: true,
    token:
      tokenIn?.address !== zeroAddress
        ? (tokenIn?.address as Address)
        : undefined,
    enabled: Boolean(tokenIn),
  })

  const { data: tokenOutBalance } = useBalance({
    chainId: chain?.id || 1,
    address: address,
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
        boxShadow: '0px 0px 50px 0px #0000001F',
        borderRadius: 16,
        p: '4',
        gap: '3',
        maxWidth: 540,
      }}
    >
      <Flex justify="between" align="center" css={{ gap: '4' }}>
        <Text style="h5" css={{ mb: '3' }}>
          Swap
        </Text>
        <SettingsDropdown
          swapMode={swapMode}
          slippagePercentage={slippagePercentage}
          setSlippagePercentage={setSlippagePercentage}
          deadline={deadline}
          setDeadline={setDeadline}
          matchmaker={matchmaker}
          setMatchmaker={setMatchmaker}
        />
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
              pattern="^[0-9]*[.]?[0-9]*$"
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
                const regex = /^[0-9]*[.]?[0-9]*$/

                if (regex.test(inputValue) || inputValue === '') {
                  setAmountIn(inputValue)
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
              disabled={true}
              placeholder="0"
              size="large"
              ellipsify
              css={{
                backgroundColor: 'transparent',
                p: 0,
                borderRadius: 0,
                _focus: { boxShadow: 'none' },
              }}
              value={formatNumber(amountOut, 8)}
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
      <QuoteInfo
        errorFetchingQuote={errorFetchingQuote}
        isFetchingQuote={isFetchingQuote}
        quotedAmountOut={quote}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
        amountOut={amountOut}
      />
      <ModeToggle swapMode={swapMode} setSwapMode={setSwapMode} />
      <SwapModal
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
        amountOut={amountOut}
        referrer={deepLinkReferrer}
        slippagePercentage={slippagePercentage}
        deadline={deadline}
        tokenInBalance={tokenInBalance}
        isFetchingQuote={isFetchingQuote}
        errorFetchingQuote={errorFetchingQuote}
      />
    </Flex>
  )
}
export default Swap
