import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Address, formatUnits, parseUnits } from 'viem'
import { useContractReads, usePrepareContractWrite } from 'wagmi'

export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'

const useQuote = (
  tokenIn: Token,
  tokenOut: Token,
  feeAmount: FeeAmount,
  amountIn: number
) => {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: feeAmount,
  })

  const {
    data: poolData,
    isError,
    isLoading,
  } = useContractReads({
    contracts: [
      {
        address: currentPoolAddress as Address,
        abi: IUniswapV3PoolABI.abi,
        functionName: 'token0',
      },
      {
        address: currentPoolAddress as Address,
        abi: IUniswapV3PoolABI.abi,
        functionName: 'token1',
      },
      {
        address: currentPoolAddress as Address,
        abi: IUniswapV3PoolABI.abi,
        functionName: 'fee',
      },
    ],
  })

  console.log(
    poolData?.[0]?.result,
    poolData?.[1]?.result,
    poolData?.[2]?.result,
    parseUnits(amountIn.toString(), tokenIn?.decimals),
    0
  )

  const {
    data: quotedData,
    config,
    isLoading: isLoadingQuote,
    error: quoteError,
  } = usePrepareContractWrite({
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 1,
    address: poolData?.[0]?.result ? QUOTER_CONTRACT_ADDRESS : undefined,
    abi: Quoter.abi,
    functionName: 'quoteExactInputSingle',
    args: [
      // poolData?.[0]?.result,
      // poolData?.[1]?.result,
      tokenIn?.address,
      tokenOut?.address,
      poolData?.[2]?.result,
      parseUnits(amountIn.toString(), tokenIn?.decimals),
      0,
    ],
  })

  const quotedAmountOut = quotedData?.result
    ? formatUnits(quotedData?.result as bigint, tokenOut?.decimals)
    : undefined
  const loading = isLoading || isLoadingQuote
  const error = isError || quoteError

  return { quotedAmountOut, loading, error }
}

export default useQuote
