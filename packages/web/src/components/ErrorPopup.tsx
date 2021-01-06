import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle
} from '@chakra-ui/react'
import React from 'react'

type ErrorProps = {
  error: {
    name: string
    message: string
  }
}

const ErrorPopup: React.FC<ErrorProps & AlertProps> = ({ error, ...props }) => {
  return (
    <Alert status="error" {...props}>
      <AlertIcon color="red.500" />
      <AlertTitle mr={4}>{error.name}</AlertTitle>
      <AlertDescription textAlign="center">{error.message}</AlertDescription>
    </Alert>
  )
}

export default ErrorPopup
