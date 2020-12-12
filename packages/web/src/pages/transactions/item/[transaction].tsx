import { Box, Flex, StackDivider, Text, VStack } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import Cash from '@components/cash'
import Layout from '@components/layout'
import RelatedList from '@components/relatedList'
import TransactionData from '@components/transactionData'

type Transaction = {
  _id: string
  title: string
  amount: number
  timestamp: number
  month: string
  items: {
    [title: string]: {
      value: number
      related_users: string[]
    }
  }
  payers: {
    [user_id: string]: number
  }
  related: string[]
}

type Balance = {
  [user_id: string]: number
}

type Props = {
  transaction: Transaction
  balance: Balance
}

const Transaction: React.FC<Props> = ({ transaction, balance }) => {
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Carregando...</p>
  }

  const date = new Date(transaction.timestamp)
  const formattedDate = date.toLocaleString('pt-BR')

  const individual_payment = transaction.related.map(id => {
    return {
      id,
      value: transaction.payers[id] || 0
    }
  })

  const individual_balance = transaction.related.map(id => {
    return {
      id,
      value: balance[id] || 0
    }
  })

  const individual_amount = transaction.related.map((id, index) => {
    return {
      id,
      value: individual_payment[index].value - individual_balance[index].value
    }
  })

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/transactions' }]}>
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing="8px"
        align="stretch"
      >
        <Flex as="section" flexDir="column" align="center">
          <Box as="span" fontSize="32px" fontWeight="700" color="purple.800">
            {transaction.title}
          </Box>
          <Box as="span" fontSize="16px" color="purple.600" fontWeight="600">
            {formattedDate}
          </Box>
        </Flex>
        <VStack spacing="6px" align="flex-start">
          <Flex align="flex-end">
            <Text color="purple.600" fontSize="18px" marginRight="4px">
              Valor Total da Compra:{'  '}
            </Text>
            <Cash amount={transaction.amount} />
          </Flex>
          <TransactionData data={individual_amount}>
            Valor Individual:
          </TransactionData>
          <TransactionData data={individual_payment}>
            Pagamento Individual:
          </TransactionData>
          <TransactionData data={individual_balance}>
            Agiotagem Final:
          </TransactionData>
        </VStack>
        <VStack
          divider={
            <StackDivider
              borderColor="purple.800"
              marginX="16px"
              height="0.5px"
            />
          }
          spacing="4px"
          align="stretch"
        >
          {Object.entries(transaction.items).map(item => (
            <Flex justify="space-between" align="center" key={item[0]}>
              <Text color="purple.600" fontSize="16px">
                {item[0]}
              </Text>
              <RelatedList related={item[1].related_users} />
              <Flex flexDir="column" align="flex-end">
                <Cash amount={item[1].value} />
                {item[1].related_users.length > 1 && (
                  <Flex align="center">
                    <Text
                      marginRight="2px"
                      fontWeight="300"
                      color="purple.600"
                      fontSize="12px"
                    >
                      {item[1].related_users.length}x
                    </Text>
                    <Cash
                      amount={item[1].value / item[1].related_users.length}
                    />
                  </Flex>
                )}
              </Flex>
            </Flex>
          ))}
        </VStack>
      </VStack>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [{ params: { transaction: 'id-teste' } }]

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<
  Props,
  { transaction: string }
> = async context => {
  const _id = context.params?.transaction || ''

  const transaction: Transaction = {
    _id,
    title: 'Compra 1',
    timestamp: 1607360198652,
    month: '202012',
    items: {
      'item 1 da compra 1': {
        value: 15,
        related_users: ['P', 'G', 'F']
      },
      'item 2': {
        value: 10,
        related_users: ['P', 'G']
      }
    },
    payers: {
      P: 25
    },
    amount: 25,
    related: ['P', 'G', 'F']
  }

  const balance: Balance = {
    P: 15,
    G: -10,
    F: -5
  }

  return {
    props: {
      transaction,
      balance
    },
    revalidate: 60
  }
}

export default Transaction
