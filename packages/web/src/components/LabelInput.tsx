import { ComponentWithAs, Input, InputProps } from '@chakra-ui/react'
import React from 'react'

const LabelInput: ComponentWithAs<'input', InputProps> = ({ ...props }) => {
  return (
    <Input
      variant="flushed"
      size="sm"
      fontSize="1rem"
      borderColor="purple.400"
      focusBorderColor="purple.600"
      errorBorderColor="red.500"
      minLength={2}
      maxLength={255}
      {...props}
    />
  )
}

export default LabelInput
