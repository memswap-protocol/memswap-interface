import { useCallback, useState } from 'react'
import { Button, Flex, Text } from '../primitives'
import { Token, SelectTokenModal } from './SelectTokenModal'
import { Token as UniswapToken } from '@uniswap/sdk-core'
import Input from '../primitives/Input'
import { useBalance, useAccount } from 'wagmi'
import { Address, zeroAddress } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { SwapButton } from './SwapButton'
import useQuote from '../../hooks/useQuote'

const Swap = () => {
  const [tokenIn, setTokenIn] = useState<Token>()
  const [tokenOut, setTokenOut] = useState<Token>()

  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')

  const { address } = useAccount()

  const test = useQuote(
    new UniswapToken(
      tokenIn?.chainId || 1,
      (tokenIn?.address as Address) ||
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      tokenIn?.decimals || 16,
      tokenIn?.symbol,
      tokenIn?.name,
      undefined
    ),
    new UniswapToken(
      tokenOut?.chainId || 1,
      (tokenOut?.address as Address) ||
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      tokenOut?.decimals || 16,
      tokenOut?.symbol,
      tokenOut?.name,
      undefined
    ),
    100,
    Number(amountIn)
  )

  console.log(test)

  // console.log(executionPrice, midPrice, error)

  const {
    data: tokenInBalance,
    isLoading: fetchingTokenInBalance,
    isError: errorFetchingTokenInBalance,
  } = useBalance({
    address: tokenIn ? address : undefined,
    watch: tokenIn ? true : false,
    token:
      tokenIn && tokenIn?.address !== zeroAddress
        ? (tokenIn?.address as Address)
        : undefined,
  })

  const {
    data: tokenOutBalance,
    isLoading: fetchingTokenOutBalance,
    isError: errorFetchingTokenOutBalance,
  } = useBalance({
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
    const currentAmountIn = amountIn
    const currentAmountOut = amountOut

    setTokenIn(currentTokenOut)
    setTokenOut(currentTokenIn)
    setAmountIn(currentAmountOut)
    setAmountOut(currentAmountIn)
  }, [tokenOut, tokenIn, amountOut, amountIn])

  return (
    <Flex
      direction="column"
      css={{
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0px 0px 50px 0px #0000001F',
        borderRadius: 8,
        p: '4',
        gap: '1',
        maxWidth: 600,
      }}
    >
      <Text style="h5" css={{ mb: '3' }}>
        Swap
      </Text>
      <Flex
        align="start"
        justify="between"
        css={{
          position: 'relative',
          backgroundColor: 'gray8',
          borderRadius: 8,
          p: '5',
        }}
      >
        <Input
          type="number"
          placeholder="0"
          css={{ maxWidth: 100, sm: { maxWidth: 'none' } }}
          value={amountIn}
          onChange={(e) => {
            if (e.target.value) {
              setAmountIn(e.target.value)
            } else {
              setAmountIn('')
            }
          }}
        />
        <Flex direction="column" align="end" css={{ gap: '2' }}>
          <SelectTokenModal token={tokenIn} setToken={setTokenIn} />
          {fetchingTokenInBalance ? <Text>Loading</Text> : null}
          {!fetchingTokenInBalance && errorFetchingTokenInBalance ? (
            <Text>Error</Text>
          ) : null}
          {tokenInBalance ? (
            <Text>Balance: {tokenInBalance?.formatted}</Text>
          ) : null}
        </Flex>
        <Button
          size="xs"
          color="gray4"
          css={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -24,
            margin: 'auto',
            maxWidth: 'max-content',
            height: 40,
            width: 40,
          }}
          onClick={switchTokens}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </Button>
      </Flex>
      <Flex
        align="start"
        justify="between"
        css={{ backgroundColor: 'gray8', borderRadius: 8, p: '5' }}
      >
        <Input
          type="number"
          placeholder="0"
          css={{ maxWidth: 100, sm: { maxWidth: 'none' } }}
          value={amountOut}
          onChange={(e) => {
            if (e.target.value) {
              setAmountOut(e.target.value)
            } else {
              setAmountOut('')
            }
          }}
        />
        <Flex direction="column" align="end" css={{ gap: '2' }}>
          <SelectTokenModal token={tokenOut} setToken={setTokenOut} />
          {fetchingTokenOutBalance ? <Text>Loading</Text> : null}
          {!fetchingTokenOutBalance && errorFetchingTokenOutBalance ? (
            <Text>Error</Text>
          ) : null}
          {tokenOutBalance ? (
            <Text>Balance: {tokenOutBalance?.formatted}</Text>
          ) : null}
        </Flex>
      </Flex>
      <SwapButton
        address={address}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        tokenInBalance={tokenInBalance}
      />
    </Flex>
  )
}
export default Swap
