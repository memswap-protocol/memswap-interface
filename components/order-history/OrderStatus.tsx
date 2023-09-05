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
    icon: faClock,
    text: 'Pending',
    color: 'yellow10',
  },
  cancelled: {
    icon: faCircleXmark,
    text: 'Cancelled',
    color: 'red10',
  },
  expired: {
    icon: faClock,
    text: 'Expired',
    color: 'gray9',
  },
  completed: {
    icon: faCircleCheck,
    text: 'Completed',
    color: 'green10',
  },
}

export const OrderStatus: FC<OrderStatusProps> = ({ intent }) => {
  let orderStatus: OrderStatus

  if (intent.isCancelled) {
    orderStatus = 'cancelled'
  } else if (intent.isValidated) {
    orderStatus = 'completed'
  }
  // Get the current Unix timestamp in seconds - UTC time
  else if (Math.floor(Date.now() / 1000) >= intent.deadline) {
    orderStatus = 'expired'
  } else {
    orderStatus = 'pending'
  }

  const ui = statusToUI[orderStatus]

  return (
    <Flex align="center" css={{ gap: '2' }}>
      <Box css={{ color: ui.color }}>
        <FontAwesomeIcon icon={ui.icon} />
      </Box>
      <Text style="subtitle2">{ui.text}</Text>
    </Flex>
  )
}
