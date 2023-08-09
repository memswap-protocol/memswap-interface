import { Token } from '../components/swap/SelectTokenModal'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import { FeeAmount } from '@uniswap/v3-sdk'
import { formatUnits, parseUnits } from 'viem'
import { usePrepareContractWrite } from 'wagmi'

// @TODO: configure as env variables
export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 1

const useQuote = (
  amountIn: number,
  feeAmount: FeeAmount,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { data, isLoading, isError, error } = usePrepareContractWrite({
    chainId: CHAIN_ID,
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

  const quotedAmountOut = data?.result
    ? formatUnits(data?.result as bigint, tokenOut?.decimals || 18)
    : undefined

  return { quotedAmountOut, isLoading, isError }
}

export default useQuote
