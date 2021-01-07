import { Heading, HeadingProps } from '@chakra-ui/react'
import React from 'react'

const Title: React.FC<HeadingProps> = ({ children, ...props }) => {
  return <Heading {...props}>{children}</Heading>
}

export default Title
