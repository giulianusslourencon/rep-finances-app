import { Box } from '@chakra-ui/react'
import React from 'react'

type Props = {
  amount: number
}

const Cash: React.FC<Props> = ({ amount }) => {
  return (
    <Box
      fontWeight="300"
      fontSize="32px"
      color={amount < 0 ? 'red.500' : 'purple.800'}
    >
      R$ {amount.toFixed(2)}
    </Box>
  )
}

export default Cash
