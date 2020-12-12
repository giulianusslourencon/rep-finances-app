import { Box, useStyleConfig } from '@chakra-ui/react'
import React from 'react'

type Props = {
  amount: number
  size?: string
}

const Cash: React.FC<Props> = ({ amount, size }) => {
  const variant = amount < 0 ? 'negative' : 'normal'

  const styles = useStyleConfig('Cash', { size, variant })

  return <Box sx={styles}>R$ {amount.toFixed(2)}</Box>
}

export default Cash
