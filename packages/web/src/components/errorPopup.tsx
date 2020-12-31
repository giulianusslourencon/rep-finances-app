import { Box, BoxProps, Heading, Text } from '@chakra-ui/react'
import React from 'react'

type ErrorProps = {
  error: {
    name: string
    message: string
  }
}

const ErrorPopup: React.FC<ErrorProps & BoxProps> = ({ error, ...props }) => {
  return (
    <Box textAlign="center" {...props}>
      <Heading color="red.500">{error.name}</Heading>
      <Text color="purple.800">{error.message}</Text>
    </Box>
  )
}

export default ErrorPopup
