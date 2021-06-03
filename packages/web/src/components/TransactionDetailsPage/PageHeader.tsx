import { FlexProps, Flex } from '@chakra-ui/react'
import React from 'react'

import { Time, Title } from '@modules/resource'
type Props = {
  title: string
  date: string
}

export const PageHeader: React.FC<Props & FlexProps> = ({ title, date }) => {
  const dateObj = new Date(date)
  const formattedDate = dateObj.toLocaleString('pt-BR')

  return (
    <Flex as="header" flexDir="column" align="center">
      <Title as="h1" size="xl" textAlign="center">
        {title}
      </Title>
      <Time>{formattedDate}</Time>
    </Flex>
  )
}
