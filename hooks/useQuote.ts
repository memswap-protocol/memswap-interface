import {
  createPublicClient,
  formatUnits,
  http,
  parseUnits,
  zeroAddress,
} from 'viem'
import { useNetwork } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { Token } from '../components/swap/SelectTokenModal'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import { FeeAmount } from '@uniswap/v3-sdk'
import wrappedContracts from '../constants/wrappedContracts'
import { useEffect, useState } from 'react'

export const QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'

const useQuote = (
  amountIn: number,
  feeAmount: FeeAmount,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain: activeChain } = useNetwork()
  const [quotedAmountOut, setQuotedAmountOut] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const wagmiChain =
    Object.values(wagmiChains).find(
      (chain) => chain.id === (activeChain?.id || 1)
    ) || wagmiChains.mainnet

  const publicClient = createPublicClient({
    chain: wagmiChain,
    transport: http(),
  })

  const isEthToWethSwap =
    (tokenIn?.address === zeroAddress ||
      tokenIn?.address === wrappedContracts[activeChain?.id || 1]) &&
    (tokenOut?.address === zeroAddress ||
      tokenOut?.address === wrappedContracts[activeChain?.id || 1])

  const getResolvedAddress = (address?: string) =>
    address === zeroAddress ? wrappedContracts[activeChain?.id || 1] : address

  useEffect(() => {
    setIsError(false)
    if (isEthToWethSwap) {
      setQuotedAmountOut(amountIn ? amountIn.toString() : undefined)
    } else if (tokenIn && tokenOut && amountIn && !isEthToWethSwap) {
      const fetchQuote = async () => {
        try {
          setIsLoading(true)
          const { result, request } = await publicClient.simulateContract({
            address: QUOTER_CONTRACT_ADDRESS,
            abi: Quoter.abi,
            functionName: 'quoteExactInputSingle',
            account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', //@TODO: update account
            args: [
              getResolvedAddress(tokenIn?.address),
              getResolvedAddress(tokenOut?.address),
              feeAmount,
              parseUnits(amountIn.toString(), tokenIn?.decimals || 18),
              0,
            ],
          })

          console.log(result, request)
          setQuotedAmountOut(
            result
              ? formatUnits(result as bigint, tokenOut?.decimals || 18)
              : undefined
          )
          setIsLoading(false)
        } catch (e) {
          console.log(e)
          setQuotedAmountOut(undefined)
          setIsError(true)
          setIsLoading(false)
        }
      }
      fetchQuote()
    }
  }, [amountIn, tokenIn, tokenOut])

  return { quotedAmountOut, isLoading, isError }
}

export default useQuote
