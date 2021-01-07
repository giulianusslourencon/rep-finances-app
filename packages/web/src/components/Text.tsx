import { Text, TextProps } from '@chakra-ui/react'
import React from 'react'

const StyledText: React.FC<TextProps> = ({ children, ...props }) => {
  return <Text {...props}>{children}</Text>
}

export default StyledText
