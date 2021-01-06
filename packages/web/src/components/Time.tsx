import {
  Box,
  ComponentWithAs,
  BoxProps,
  useStyleConfig
} from '@chakra-ui/react'
import React from 'react'

const Time: ComponentWithAs<'time', BoxProps> = ({ children, ...props }) => {
  const styles = useStyleConfig('Text')

  return (
    <Box as="time" sx={styles} {...props}>
      {children}
    </Box>
  )
}

export default Time
