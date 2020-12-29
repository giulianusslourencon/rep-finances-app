import { Input, InputProps } from '@chakra-ui/react'
import React from 'react'

const StyledInput: React.FC<InputProps> = ({ ...props }) => {
  return (
    <Input
      variant="flushed"
      size="sm"
      fontSize="16px"
      borderColor="purple.400"
      focusBorderColor="purple.600"
      {...props}
    />
  )
}

export default StyledInput
