import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle
} from '@chakra-ui/react'
import React from 'react'

import { ErrorResponse } from '@utils/types'

type ErrorProps = {
  error: ErrorResponse
}

export const ErrorPopup: React.FC<ErrorProps & AlertProps> = ({
  error,
  ...props
}) => {
  return (
    <Alert status="error" {...props}>
      <AlertIcon color="red.500" />
      <AlertTitle mr={4}>{error.name}</AlertTitle>
      <AlertDescription textAlign="center">
        {error.errors[0].message}
      </AlertDescription>
    </Alert>
  )
}
