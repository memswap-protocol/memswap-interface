import { Dispatch, FC, SetStateAction } from 'react'
import { Input, Text, Flex } from '../../primitives'

type SlippageInputProps = {
  slippagePercentage: string
  setSlippagePercentage: Dispatch<SetStateAction<string>>
}

export const SlippageInput: FC<SlippageInputProps> = ({
  slippagePercentage,
  setSlippagePercentage,
}) => {
  const slippageHighWarning = Number(slippagePercentage) >= 1.5
  const slippageLowWarning =
    slippagePercentage !== '' && Number(slippagePercentage) < 0.1

  return (
    <Flex direction="column" css={{ gap: '2' }}>
      <Text style="subtitle2">Max Slippage</Text>
      <Input
        value={slippagePercentage}
        placeholder="0.5"
        onChange={(e) => {
          const inputValue = e.target.value
          const regex = /^[0-9]*[.,]?[0-9]*$/

          if (
            (regex.test(inputValue) &&
              Number(inputValue) >= 0 &&
              Number(inputValue) <= 100 &&
              inputValue.length <= 4) ||
            inputValue === ''
          ) {
            setSlippagePercentage(inputValue)
          }
        }}
        onBlur={() => {
          if (slippagePercentage === '') {
            setSlippagePercentage('0.5')
          }
        }}
        icon={<>%</>}
        iconPosition="right"
      />
      {slippageHighWarning || slippageLowWarning ? (
        <Text color="error" style="body2">
          {slippageHighWarning
            ? 'Slippage is high: your tx could be frontrun'
            : 'Slippage is low: tx is likely to revert'}
        </Text>
      ) : null}
    </Flex>
  )
}
