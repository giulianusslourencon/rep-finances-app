import { Heading, HeadingProps } from '@chakra-ui/react'
import React from 'react'

export const Title: React.FC<HeadingProps> = ({ children, ...props }) => {
  return <Heading {...props}>{children}</Heading>
}
