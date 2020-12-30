import { Box, Flex, StackDivider, Text, VStack } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import Cash from '@components/cash'
import ErrorPopup from '@components/errorPopup'
import Layout from '@components/layout'
import RelatedList from '@components/relatedList'
import TransactionData from '@components/transactionData'

import API from '@utils/api'

type Transaction = {
  _id: string
  title: string
  amount: number
  date: string
  month: string
  items: {
    [itemName: string]: {
      amount: number
      related_users: string[]
    }
  }
  payers: {
    [userId: string]: number
  }
  related: string[]
}

type Balance = {
  [userId: string]: number
}

type Props = {
  error?: { name: string; message: string }
  transaction: Transaction
  balance: Balance
}

const Transaction: React.FC<Props> = ({ error, transaction, balance }) => {
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Carregando...</p>
  }

  const date = new Date(transaction.date)
  const formattedDate = date.toLocaleString('pt-BR')

  const individual_payment = transaction.related.map(id => {
    return {
      id,
      amount: transaction.payers[id] || 0
    }
  })

  const individual_balance = transaction.related.map(id => {
    return {
      id,
      amount: balance[id] || 0
    }
  })

  const individual_amount = transaction.related.map((id, index) => {
    return {
      id,
      amount:
        individual_payment[index].amount - individual_balance[index].amount
    }
  })

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/transactions' }]}>
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing="8px"
        align="stretch"
      >
        {error && <ErrorPopup error={error} />}
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
                <Cash amount={item[1].amount} />
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
                      amount={item[1].amount / item[1].related_users.length}
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
  let paths: { params: { transaction: string } }[] = []
  try {
    const response = await API.get<Transaction[]>('/transactions', {
      params: {
        skip: 0,
        limit: 5
      }
    })
    const transactions = response.data

    paths = transactions.map(transaction => {
      return { params: { transaction: transaction._id } }
    })
  } catch (error) {}

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

  const props: Props = {
    balance: {},
    transaction: {
      _id: '',
      amount: 0,
      date: Date.now().toString(),
      items: {},
      month: '',
      payers: {},
      related: [],
      title: ''
    }
  }

  try {
    const response = await API.get<Props>(`/transactions/${_id}`)
    const { transaction, balance } = response.data

    props.transaction = transaction
    props.balance = balance
  } catch (error) {
    const errorMessage = error.response?.data || {
      name: error.code,
      message: error.message
    }
    props.error = errorMessage
  }

  return {
    props
  }
}

export default Transaction
