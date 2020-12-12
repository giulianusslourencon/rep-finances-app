import { Box } from '@chakra-ui/react'
import React from 'react'

type Props = {
  id: string
}

const UserIdBox: React.FC<Props> = ({ id }) => {
  return (
    <Box
      bgColor="purple.400"
      borderRadius="8px"
      width="72px"
      height="72px"
      fontSize="52px"
      textAlign="center"
      verticalAlign="center"
      textTransform="uppercase"
    >
      {id}
    </Box>
  )
}

export default UserIdBox
