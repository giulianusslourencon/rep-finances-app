import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'

type ErrorProps = {
  error: {
    name: string
    message: string
  }
}

const ErrorPopup: React.FC<ErrorProps> = ({ error }) => {
  return (
    <Box textAlign="center">
      <Heading color="red.500">{error.name}</Heading>
      <Text color="purple.800">{error.message}</Text>
    </Box>
  )
}

export default ErrorPopup
