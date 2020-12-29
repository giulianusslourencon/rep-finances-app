import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputFieldProps,
  NumberInputProps,
  NumberInputStepper
} from '@chakra-ui/react'
import React from 'react'

type AmountInputProps = NumberInputProps & {
  fieldProps?: NumberInputFieldProps
}

const AmountInput: React.FC<AmountInputProps> = ({ fieldProps, ...props }) => {
  return (
    <NumberInput
      variant="flushed"
      borderColor="purple.400"
      focusBorderColor="purple.600"
      size="sm"
      precision={2}
      step={0.5}
      min={0}
      {...props}
    >
      <NumberInputField fontSize="16px" width="100px" {...fieldProps} />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}

export default AmountInput
