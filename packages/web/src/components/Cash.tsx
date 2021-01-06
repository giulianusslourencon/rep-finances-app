import {
  TextProps,
  Text,
  ComponentWithAs,
  useStyleConfig
} from '@chakra-ui/react'
import React from 'react'

type Props = {
  amount: number
  size?: string
  variant?: string
}

const Cash: ComponentWithAs<'span', Props & TextProps> = ({
  amount,
  size,
  variant,
  ...remaining
}) => {
  variant = amount < 0 ? 'negative' : variant

  const styles = useStyleConfig('Cash', { size, variant })

  return (
    <Text as="span" sx={styles} {...remaining}>
      R$ {amount.toFixed(2)}
    </Text>
  )
}

export default Cash
