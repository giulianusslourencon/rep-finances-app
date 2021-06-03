import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper
} from '@chakra-ui/react'
import React from 'react'

export const FullNumberInput: React.FC<NumberInputProps> = ({ ...props }) => {
  return (
    <NumberInput
      {...props}
      allowMouseWheel
      variant="flushed"
      borderColor="purple.400"
      focusBorderColor="purple.600"
      size="sm"
      width="100%"
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}
