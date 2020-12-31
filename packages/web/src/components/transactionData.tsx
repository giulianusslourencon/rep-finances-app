import { Flex, StackProps, Text, VStack } from '@chakra-ui/react'
import React from 'react'

import Cash from './cash'
import IdBox from './idBox'

type Props = {
  data: { id: string; amount: number }[]
}

const TransactionData: React.FC<Props & StackProps> = ({
  children,
  data,
  ...props
}) => {
  return (
    <VStack spacing="4px" align="flex-start" {...props}>
      <Text color="purple.600" fontSize="18px">
        {children}
      </Text>
      {data.map(user => (
        <Flex key={user.id} align="center">
          <IdBox id={user.id} marginRight="4px" marginLeft="16px" />
          <Cash amount={user.amount} />
        </Flex>
      ))}
    </VStack>
  )
}

export default TransactionData
