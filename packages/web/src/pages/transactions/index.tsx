import { Box, Flex, Link, StackDivider, VStack } from '@chakra-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import React from 'react'

import Cash from '@components/cash'
import ErrorPopup from '@components/errorPopup'
import Layout from '@components/layout'
import RelatedList from '@components/relatedList'

import API from '@utils/api'

type Transaction = {
  _id: string
  title: string
  date: string
  amount: number
  related: string[]
}

type Props = {
  error?: { name: string; message: string }
  transactions: Transaction[]
}

const getFormattedDate = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const Historic: NextPage<Props> = ({ error, transactions }) => {
  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing="8px"
        align="stretch"
      >
        {error && <ErrorPopup error={error} />}
        {transactions.map(transaction => (
          <NextLink
            href={`/transactions/item/${transaction._id}`}
            key={transaction._id}
          >
            <Flex flexDir="column">
              <Flex justify="space-between" align="flex-start">
                <Link fontSize="24px" color="purple.800" fontWeight="700">
                  {transaction.title}
                </Link>
                <Box fontSize="16px" color="purple.600" fontWeight="600">
                  {getFormattedDate(transaction.date)}
                </Box>
              </Flex>
              <Flex justify="space-between" align="flex-end">
                <Cash amount={transaction.amount} />
                <RelatedList related={transaction.related} />
              </Flex>
            </Flex>
          </NextLink>
        ))}
      </VStack>
    </Layout>
  )
}

Historic.getInitialProps = async () => {
  // const page = parseInt(query.page?.toString() || '0')

  const props: Props = {
    transactions: []
  }

  try {
    const response = await API.get<Transaction[]>('/transactions')
    props.transactions = response.data
  } catch (error) {
    const errorMessage = error.response?.data || {
      name: error.code,
      message: error.message
    }
    props.error = errorMessage
  }

  return props
}

export default Historic
