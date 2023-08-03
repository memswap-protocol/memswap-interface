import { useState } from 'react'
import { Flex, Text } from '../primitives'
import { Currency, SelectCurrency } from './SelectCurrency'
import Input from '../primitives/Input'

const Swap = () => {
  const [currencyFrom, setCurrencyFrom] = useState<Currency>()
  const [currencyTo, setCurrencyTo] = useState<Currency>()

  const [fromAmount, setFromAmount] = useState<number | undefined>()
  const [toAmount, setToAmount] = useState<number | undefined>()

  return (
    <Flex
      direction="column"
      css={{
        width: '100%',
        backgroundColor: 'primary11',
        borderRadius: 8,
        p: '4',
        gap: '1',
        maxWidth: 600,
      }}
    >
      <Text style="h6" css={{ mb: '3' }}>
        Swap
      </Text>
      <Flex
        align="center"
        justify="between"
        css={{ backgroundColor: 'primary8', borderRadius: 8, p: '4' }}
      >
        <Input
          type="number"
          placeholder="0"
          value={fromAmount}
          onChange={(e) => {
            if (e.target.value) {
              setFromAmount(Math.abs(Number(e.target.value)))
            } else {
              setFromAmount(undefined)
            }
          }}
        />
        <SelectCurrency currency={currencyFrom} setCurrency={setCurrencyFrom} />
      </Flex>
      <Flex
        align="center"
        justify="between"
        css={{ backgroundColor: 'primary8', borderRadius: 8, p: '4' }}
      >
        <Input type="number" placeholder="0" />
        <SelectCurrency currency={currencyTo} setCurrency={setCurrencyTo} />
      </Flex>
    </Flex>
  )
}
export default Swap
