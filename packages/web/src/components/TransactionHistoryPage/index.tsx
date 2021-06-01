import { Flex, Link, StackDivider, VStack } from '@chakra-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import React from 'react'

import { Cash, ErrorPopup, Layout, RelatedList, Time, Title } from '@modules'

import { ErrorResponse, PaginationProps, TransactionList } from '@utils/types'

import { PageFooter } from './PageFooter'

export type TransactionHistoryPageProps = {
  error?: ErrorResponse
  transactions: TransactionList
  paginationProps: PaginationProps
}

export const TransactionHistoryPage: NextPage<TransactionHistoryPageProps> = ({
  error,
  transactions,
  paginationProps
}) => {
  const getFormattedDate = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <Layout
      buttons={[
        { title: 'Voltar', href: '/' },
        { title: 'Adicionar', href: '/transactions/new' }
      ]}
      footer={<PageFooter paginationProps={paginationProps} />}
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
