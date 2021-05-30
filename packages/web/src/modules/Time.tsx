import { Text, TextProps } from '@chakra-ui/react'
import React from 'react'

export const Time: React.FC<TextProps> = ({ children, ...props }) => {
  return (
    <Text as="time" {...props}>
      {children}
    </Text>
  )
}
