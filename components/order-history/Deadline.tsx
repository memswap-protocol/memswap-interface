import { FC, useMemo } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Text } from '../../components/primitives'

dayjs.extend(relativeTime)

type DeadlineProps = {
  deadline: number
}

export const Deadline: FC<DeadlineProps> = ({ deadline }) => {
  const relativeDeadline = useMemo(
    () => dayjs.unix(deadline).fromNow(),
    [deadline]
  )

  return <Text style="subtitle2">{relativeDeadline}</Text>
}
