import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Input, Text, Flex } from '../../primitives'
import { isAddress, Address } from 'viem'
import { MATCHMAKER } from '../../../constants/contracts'
import { useEnsAddress, useEnsName } from 'wagmi'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { isENSName } from '../../../utils/ens'
import { useSupportedNetwork } from '../../../hooks'

type MatchmakerInputProps = {
  matchmaker: Address
  setMatchmaker: Dispatch<SetStateAction<Address>>
}

export const MatchmakerInput: FC<MatchmakerInputProps> = ({
  matchmaker,
  setMatchmaker,
}) => {
  const [input, setInput] = useState<string>(matchmaker)
  const { chain } = useSupportedNetwork()

  const {} = useEnsName({
    address: input as Address,
    enabled: isAddress(input),
    onSuccess(data) {
      if (data) {
        setInput(data)
        setMatchmaker(input as Address)
      }
    },
  })

  const { isLoading, isError } = useEnsAddress({
    name: input,
    enabled: isENSName(input),
    onSuccess(data) {
      if (data) {
        setMatchmaker(data)
      }
    },
  })

  return (
    <Flex direction="column" css={{ gap: '2' }}>
      <Text style="subtitle2">Matchmaker</Text>
      <Input
        value={input}
        placeholder={'Address or ENS'}
        onChange={(e) => {
          setInput(e.target.value)
          if (isAddress(e.target.value)) {
            setMatchmaker(e.target.value)
          }
        }}
        onBlur={() => {
          if (!isAddress(matchmaker)) {
            setMatchmaker(MATCHMAKER[chain.id])
          }
        }}
        icon={isLoading ? <LoadingSpinner /> : null}
        iconPosition="right"
      />
      {isError ? (
        <Text color="error" style="body2">
          Could not resolve ENS name
        </Text>
      ) : null}
    </Flex>
  )
}
