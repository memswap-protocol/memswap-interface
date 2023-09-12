import { FC } from 'react'
import { ApiIntent } from '../../lib/types'
import { Box, Flex, Text } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleXmark,
  faClock,
} from '@fortawesome/free-solid-svg-icons'

type OrderStatusProps = {
  intent: ApiIntent
}

type OrderStatus = 'pending' | 'cancelled' | 'expired' | 'completed'

const statusToUI = {
  pending: {
    text: 'Pending',
    icon: (
      <Box css={{ color: 'yellow10' }}>
        <FontAwesomeIcon icon={faClock} />
      </Box>
    ),
  },
  cancelled: {
    text: 'Cancelled',
    icon: (
      <Box css={{ color: 'red10' }}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </Box>
    ),
  },
  expired: {
    text: 'Expired',
    icon: (
      <Box css={{ color: 'gray9' }}>
        <FontAwesomeIcon icon={faClock} />
      </Box>
    ),
  },
  completed: {
    text: 'Completed',
    icon: (
      <Box css={{ color: 'green10' }}>
        <FontAwesomeIcon icon={faCircleCheck} />
      </Box>
    ),
  },
}

export const OrderStatus: FC<OrderStatusProps> = ({ intent }) => {
  let orderStatus: OrderStatus

  if (intent.isCancelled) {
    orderStatus = 'cancelled'
  } else if (intent.isPreValidated) {
    orderStatus = 'completed'
  }
  // Get the current Unix timestamp in seconds - UTC time
  else if (Math.floor(Date.now() / 1000) >= intent.endTime) {
    orderStatus = 'expired'
  } else {
    orderStatus = 'pending'
  }

  const ui = statusToUI[orderStatus]

  return (
    <Flex align="center" css={{ gap: '2' }}>
      {ui.icon}
      <Text style="subtitle2">{ui.text}</Text>
    </Flex>
  )
}
