import { Flex, StackProps, VStack, Text } from '@chakra-ui/react'
import React from 'react'

import { Cash } from '@modules/resource'

import { TransactionData } from './TransactionData'

type Props = {
  amount: number
  related: string[]
  balance: {
    [userId: string]: number
  }
  payers: {
    [userId: string]: number
  }
}

export const TransactionValuesSection: React.FC<Props & StackProps> = ({
  amount,
  related,
  balance,
  payers
}) => {
  const individualPayment = related.map(id => {
    return {
      id,
      amount: payers[id] || 0
    }
  })

  const individualBalance = related.map(id => {
    return {
      id,
      amount: balance[id] || 0
    }
  })

  const individualAmount = related.map((id, index) => {
    return {
      id,
      amount: individualPayment[index].amount - individualBalance[index].amount
    }
  })

  return (
    <VStack spacing={1.5} align="flex-start">
      <Flex as="section" align="flex-end">
        <Text fontSize="lg" marginRight={1}>
          Valor Total da Compra:{'  '}
        </Text>
        <Cash amount={amount} />
      </Flex>
      <TransactionData data={individualAmount}>
        Valor Individual:
      </TransactionData>
      <TransactionData data={individualPayment}>
        Pagamento Individual:
      </TransactionData>
      <TransactionData data={individualBalance}>
        Agiotagem Final:
      </TransactionData>
    </VStack>
  )
}
