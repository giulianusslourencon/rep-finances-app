import { Flex, StackProps, VStack } from '@chakra-ui/react'
import React from 'react'

import Cash from './Cash'
import IdBox from './IdBox'
import Text from './Text'

type Props = {
  data: { id: string; amount: number }[]
}

const TransactionData: React.FC<Props & StackProps> = ({
  children,
  data,
  ...props
}) => {
  return (
    <VStack as="section" spacing={1} align="flex-start" {...props}>
      <Text fontSize="lg">{children}</Text>
      {data.map(user => (
        <Flex key={user.id} align="center">
          <IdBox userId={user.id} marginRight={1} marginLeft={4} />
          <Cash amount={user.amount} />
        </Flex>
      ))}
    </VStack>
  )
}

export default TransactionData
