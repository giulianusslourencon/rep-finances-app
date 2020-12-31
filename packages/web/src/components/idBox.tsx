import { Center, CenterProps, useStyleConfig } from '@chakra-ui/react'
import React from 'react'

type Props = {
  id: string
  size?: string
  variant?: string
}

const IdBox: React.FC<Props & CenterProps> = ({
  id,
  size,
  variant,
  ...remaining
}) => {
  const styles = useStyleConfig('IdBox', { size, variant })

  return (
    <Center sx={styles} {...remaining}>
      {id}
    </Center>
  )
}

export default IdBox
