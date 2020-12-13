import { Box, BoxProps, useStyleConfig } from '@chakra-ui/react'
import React from 'react'

type Props = {
  amount: number
  size?: string
  variant?: string
}

const Cash: React.FC<Props & BoxProps> = ({
  amount,
  size,
  variant,
  ...remaining
}) => {
  variant = amount < 0 ? 'negative' : variant

  const styles = useStyleConfig('Cash', { size, variant })

  return (
    <Box sx={styles} {...remaining}>
      R$ {amount.toFixed(2)}
    </Box>
  )
}

export default Cash
