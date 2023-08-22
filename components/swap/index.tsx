import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useBalance, useAccount, useNetwork } from 'wagmi'
import { Address, formatUnits, zeroAddress } from 'viem'
import { FeeAmount } from '@uniswap/v3-sdk'
import { useDebounce } from 'use-debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Button, Flex, Text, Input } from '../primitives'
import { Token, SelectTokenModal } from './SelectTokenModal'
import { SwapModal } from './SwapModal'
import {
  useDeepLinkParams,
  useMounted,
  useQuote,
  useTokenList,
} from '../../hooks'
import { formatDollar, formatNumber } from '../../utils/numbers'
import { QuoteInfo } from './QuoteInfo'
import { chainDefaultTokens } from '../../constants/chainDefaultTokens'
import { USDC_TOKENS } from '../../constants/contracts'
import { SlippageDropdown } from './SlippageDropdown'
import { DeadlineDropdown } from './DeadlineDropdown'

const Swap = () => {
  const isMounted = useMounted()
  const router = useRouter()
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount({
    onConnect() {
      if (chain?.id !== 1) {
        setTokenIn(chainDefaultTokens[chain?.id || 1][0])
        setTokenOut(undefined)
      }
    },
    onDisconnect: () => {
      if (chain?.id !== 1) {
        setTokenIn(chainDefaultTokens[chain?.id || 1][0])
        setTokenOut(undefined)
      }
    },
  })

  const { tokens: tokenList, loading: loadingTokenList } = useTokenList()

  const [tokenIn, setTokenIn] = useState<Token | undefined>(
    chainDefaultTokens[1][0]
  )
  const [tokenOut, setTokenOut] = useState<Token | undefined>()

  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')

  const [debouncedAmountIn] = useDebounce(amountIn, 500)

  const [slippagePercentage, setSlippagePercentage] = useState('0.5')
  const [deadline, setDeadline] = useState(3600 * 24) // default 24hr

  // Deep Link Parameters
  const {
    tokenIn: deepLinkTokenIn,
    tokenOut: deepLinkTokenOut,
    referrer: deepLinkReferrer,
  } = useDeepLinkParams(tokenList || [])

  useEffect(() => {
    if (deepLinkTokenIn?.address) {
      setTokenIn(deepLinkTokenIn)
    }

    if (deepLinkTokenOut?.address) {
      setTokenOut(deepLinkTokenOut)
    }
  }, [deepLinkTokenIn, deepLinkTokenOut, deepLinkReferrer])

  const {
    quotedAmountOut,
    isLoading: isFetchingQuote,
    isError: errorFetchingQuote,
  } = useQuote(Number(debouncedAmountIn), FeeAmount.MEDIUM, tokenIn, tokenOut)

  const { quotedAmountOut: tokenInUSD } = useQuote(
    Number(debouncedAmountIn),
    FeeAmount.MEDIUM,
    tokenIn,
    USDC_TOKENS[chain?.id || 1]
  )

  const { quotedAmountOut: tokenOutUSD } = useQuote(
    Number(amountOut),
    FeeAmount.MEDIUM,
    tokenOut,
    USDC_TOKENS[chain?.id || 1]
  )

  useEffect(() => {
    setAmountOut(quotedAmountOut ?? '')
  }, [quotedAmountOut])

  // Reset tokens on chain switch
  useEffect(() => {
    if (isConnected) {
      setTokenIn(chainDefaultTokens[chain?.id || 1][0])
      setTokenOut(undefined)
    }
  }, [chain])

  const { data: tokenInBalance } = useBalance({
    chainId: chain?.id || 1,
    address: tokenIn ? address : undefined,
    watch: tokenIn ? true : false,
    token:
      tokenIn && tokenIn?.address !== zeroAddress
        ? (tokenIn?.address as Address)
        : undefined,
  })

  const { data: tokenOutBalance } = useBalance({
    chainId: chain?.id || 1,
    address: tokenOut ? address : undefined,
    watch: tokenOut ? true : false,
    token:
      tokenOut && tokenOut?.address !== zeroAddress
        ? (tokenOut?.address as Address)
        : undefined,
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
        borderRadius: 8,
        p: '4',
        gap: '3',
        maxWidth: 600,
      }}
    >
      <Flex justify="between" align="center" css={{ gap: '4' }}>
        <Text style="h5" css={{ mb: '3' }}>
          Swap
        </Text>
        <Flex align="center" css={{ gap: '2' }}>
          <SlippageDropdown
            slippagePercentage={slippagePercentage}
            setSlippagePercentage={setSlippagePercentage}
          />
          <DeadlineDropdown deadline={deadline} setDeadline={setDeadline} />
        </Flex>
      </Flex>
      <Flex
        direction="column"
        css={{
          position: 'relative',
          backgroundColor: 'gray2',
          borderRadius: 8,
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
              pattern="^[0-9]*[.,]?[0-9]*$"
              size="large"
              css={{
                backgroundColor: 'transaparent',
                borderRadius: 0,
                p: 0,
                _focus: { boxShadow: 'none' },
              }}
              value={amountIn}
              onChange={(e) => {
                const inputValue = e.target.value
                const regex = /^[0-9]*[.,]?[0-9]*$/

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
          borderRadius: 8,
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
        quotedAmountOut={quotedAmountOut}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
        amountOut={amountOut}
      />
      <SwapModal
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
        amountOut={amountOut}
        referrer={deepLinkReferrer}
        slippagePercentage={slippagePercentage}
        tokenInBalance={tokenInBalance}
        isFetchingQuote={isFetchingQuote}
        errorFetchingQuote={errorFetchingQuote}
      />
    </Flex>
  )
}
export default Swap
