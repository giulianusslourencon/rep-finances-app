import { Box, BoxProps, useStyleConfig } from '@chakra-ui/react'
import React from 'react'

type Props = {
  id: string
  size?: string
  variant?: string
}

const IdBox: React.FC<Props & BoxProps> = ({
  id,
  size,
  variant,
  ...remaining
}) => {
  const styles = useStyleConfig('IdBox', { size, variant })

  return (
    <Box sx={styles} {...remaining}>
      {id}
    </Box>
  )
}

export default IdBox
