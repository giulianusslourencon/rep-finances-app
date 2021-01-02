import { Center, CenterProps, useStyleConfig } from '@chakra-ui/react'
import React from 'react'

type Props = {
  userId: string
  size?: string
  variant?: string
}

const IdBox: React.FC<Props & CenterProps> = ({
  userId,
  size,
  variant,
  ...remaining
}) => {
  const styles = useStyleConfig('IdBox', { size, variant })

  return (
    <Center sx={styles} {...remaining}>
      {userId}
    </Center>
  )
}

export default IdBox
