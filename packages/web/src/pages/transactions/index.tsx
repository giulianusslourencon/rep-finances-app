import { Flex, Link, StackDivider, VStack } from '@chakra-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import React from 'react'

import Cash from '@components/Cash'
import ErrorPopup from '@components/ErrorPopup'
import Layout from '@components/Layout'
import RelatedList from '@components/RelatedList'
import Time from '@components/Time'
import Title from '@components/Title'

import API from '@utils/api'
import { TransactionList } from '@utils/types'

type Props = {
  error?: { name: string; message: string }
  transactions: TransactionList
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
    <Layout
      buttons={[
        { title: 'Voltar', href: '/' },
        { title: 'Adicionar', href: '/transactions/new' }
      ]}
    >
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing={2}
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
                <Link>
                  <Title size="lg">{transaction.title}</Title>
                </Link>
                <Time>{getFormattedDate(transaction.date)}</Time>
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

Historic.getInitialProps = async ({ query }) => {
  const page = parseInt(query.page?.toString() || '1')

  const props: Props = {
    transactions: []
  }

  try {
    const response = await API.listTransactions(page)
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
