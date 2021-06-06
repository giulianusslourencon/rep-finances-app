import {
  NumberInput,
  NumberInputField,
  NumberInputFieldProps,
  NumberInputProps
} from '@chakra-ui/react'
import React from 'react'

type AmountInputProps = NumberInputProps & {
  fieldProps?: NumberInputFieldProps
}

export const AmountInput: React.FC<AmountInputProps> = ({
  fieldProps,
  ...props
}) => {
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
      <NumberInputField
        fontSize="1rem"
        width="7rem"
        padding={0}
        {...fieldProps}
      />
    </NumberInput>
  )
}
