import { Flex, Text, VStack } from '@chakra-ui/react'
import React from 'react'

import Cash from './cash'
import IdBox from './idBox'

type Props = {
  data: { id: string; value: number }[]
}

const TransactionData: React.FC<Props> = ({ children, data }) => {
  return (
    <VStack spacing="4px" align="flex-start">
      <Text color="purple.600" fontSize="18px">
        {children}
      </Text>
      {data.map(user => (
        <Flex key={user.id} align="center">
          <IdBox id={user.id} marginRight="4px" marginLeft="16px" />
          <Cash amount={user.value} />
        </Flex>
      ))}
    </VStack>
  )
}

export default TransactionData
