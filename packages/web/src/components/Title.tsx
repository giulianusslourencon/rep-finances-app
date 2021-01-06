import { Heading, HeadingProps, useStyleConfig } from '@chakra-ui/react'
import React from 'react'

const Title: React.FC<HeadingProps> = ({ children, ...props }) => {
  const styles = useStyleConfig('Heading')

  return (
    <Heading sx={styles} {...props}>
      {children}
    </Heading>
  )
}

export default Title
