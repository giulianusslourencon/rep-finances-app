import { Text, TextProps, useStyleConfig } from '@chakra-ui/react'
import React from 'react'

const StyledText: React.FC<TextProps> = ({ children, variant, ...props }) => {
  const styles = useStyleConfig('Text', { variant })

  return (
    <Text sx={styles} {...props}>
      {children}
    </Text>
  )
}

export default StyledText
