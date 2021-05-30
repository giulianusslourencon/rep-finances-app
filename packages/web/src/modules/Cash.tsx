import { TextProps, Text, useStyleConfig } from '@chakra-ui/react'
import React from 'react'

type Props = {
  amount: number
}

export const Cash: React.FC<Props & TextProps> = ({
  amount,
  variant,
  ...props
}) => {
  variant = amount < 0 ? 'negative' : variant

  const styles = useStyleConfig('Cash', { variant })

  return (
    <Text as="span" sx={styles} {...props}>
      R$ {amount.toFixed(2)}
    </Text>
  )
}
