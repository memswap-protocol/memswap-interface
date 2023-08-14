import { FC } from 'react'
import { Text, Flex } from './'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { SystemStyleObject } from '../../styled-system/types'

type Props = {
  message?: string
  css?: SystemStyleObject
}

const ErrorWell: FC<Props> = ({ message, css }) => {
  return (
    <Flex
      css={{
        color: 'red10',
        p: '4',
        gap: '2',
        background: 'red2',
        borderRadius: 8,
        ...css,
      }}
      align="center"
    >
      <FontAwesomeIcon icon={faCircleExclamation} width={16} height={16} />
      <Text style="body2">{message || 'Oops, something went wrong.'}</Text>
    </Flex>
  )
}

export default ErrorWell
