import { Token } from '../components/swap/SelectTokenModal'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import { FeeAmount, computePoolAddress } from '@uniswap/v3-sdk'
import { Address, formatUnits, parseUnits } from 'viem'
import { useNetwork, usePrepareContractWrite } from 'wagmi'

import { Token as UniswapToken } from '@uniswap/sdk-core'

// @TODO: configure as env variables
export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'

const useQuote = (
  amountIn: number,
  feeAmount: FeeAmount,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain } = useNetwork()
  // const tokenA = new UniswapToken(
  //   tokenIn?.chainId || 1,
  //   (tokenIn?.address as Address) ||
  //     '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  //   tokenIn?.decimals || 18,
  //   tokenIn?.symbol,
  //   tokenIn?.name,
  //   undefined
  // )
  // const tokenB = new UniswapToken(
  //   tokenOut?.chainId || 1,
  //   (tokenOut?.address as Address) ||
  //     '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  //   tokenOut?.decimals || 18,
  //   tokenOut?.symbol,
  //   tokenOut?.name,
  //   undefined
  // )

  // const currentPoolAddress = computePoolAddress({
  //   factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
  //   tokenA: tokenA,
  //   tokenB: tokenB,
  //   fee: feeAmount,
  // })

  // console.log(currentPoolAddress)

  // console.log(
  //   tokenIn,
  //   tokenOut,
  //   feeAmount,
  //   parseUnits(amountIn.toString(), tokenIn?.decimals || 18),
  //   0
  // )

  const { data, config, isLoading, isError, error } = usePrepareContractWrite({
    chainId: chain?.id || 1,
    address:
      tokenIn && tokenOut && amountIn ? QUOTER_CONTRACT_ADDRESS : undefined,
    abi: Quoter.abi,
    functionName: 'quoteExactInputSingle',
    args: [
      tokenIn?.address,
      tokenOut?.address,
      feeAmount, //@TODO - verify
      parseUnits(amountIn.toString(), tokenIn?.decimals || 18),
      0,
    ],
  })

  console.log(data, config)

  const quotedAmountOut = data?.result
    ? formatUnits(data?.result as bigint, tokenOut?.decimals || 18)
    : undefined

  return { quotedAmountOut, isLoading, isError }
}

export default useQuote
