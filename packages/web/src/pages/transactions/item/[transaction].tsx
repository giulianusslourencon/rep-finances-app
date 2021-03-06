import { Flex, Grid, StackDivider, VStack, Text } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import Cash from '@components/Cash'
import ErrorPopup from '@components/ErrorPopup'
import Layout from '@components/Layout'
import RelatedList from '@components/RelatedList'
import Time from '@components/Time'
import Title from '@components/Title'
import TransactionData from '@components/TransactionData'

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
        spacing={2}
        align="stretch"
      >
        {error && <ErrorPopup error={error} />}
        <Flex as="header" flexDir="column" align="center">
          <Title as="h1" size="xl" textAlign="center">
            {transaction.title}
          </Title>
          <Time>{formattedDate}</Time>
        </Flex>
        <VStack spacing={1.5} align="flex-start">
          <Flex as="section" align="flex-end">
            <Text fontSize="lg" marginRight={1}>
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
          divider={<StackDivider borderColor="purple.800" marginX={4} />}
          spacing={1}
          align="stretch"
        >
          {Object.entries(transaction.items).map(item => (
            <Grid
              key={item[0]}
              templateColumns="7.5rem 1fr 6.875rem"
              templateRows="1fr"
              templateAreas="
                'itemName relatedUsers amount'
              "
              justifyContent="center"
              alignItems="center"
            >
              <Text gridArea="itemName">{item[0]}</Text>
              <RelatedList
                gridArea="relatedUsers"
                related={item[1].related_users}
                justify="center"
              />
              <Flex gridArea="amount" flexDir="column" align="end">
                <Cash amount={item[1].amount} />
                {item[1].related_users.length > 1 && (
                  <Flex align="center" justify="end">
                    <Text variant="thin" fontSize="xs" marginRight={0.5}>
                      {item[1].related_users.length}x
                    </Text>
                    <Cash
                      amount={item[1].amount / item[1].related_users.length}
                    />
                  </Flex>
                )}
              </Flex>
            </Grid>
          ))}
        </VStack>
      </VStack>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  let paths: { params: { transaction: string } }[] = []
  try {
    const response = await API.listTransactions(1)
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
    const response = await API.getTransaction(_id)
    const { transaction, balance } = response.data

    props.transaction = { ...transaction, related: transaction.related.sort() }
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
