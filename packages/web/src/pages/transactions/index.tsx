import { Box, Flex, Link, StackDivider, VStack } from '@chakra-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import React from 'react'

import Cash from '@components/cash'
import Layout from '@components/layout'
import RelatedList from '@components/relatedList'

type Transaction = {
  _id: string
  title: string
  timestamp: number
  amount: number
  related: string[]
}

type Props = {
  transactions: Transaction[]
}

const getFormattedDateFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const Historic: NextPage<Props> = ({ transactions }) => {
  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing="8px"
        align="stretch"
      >
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
                  {getFormattedDateFromTimestamp(transaction.timestamp)}
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

Historic.getInitialProps = async ({ query }) => {
  const page = parseInt(query.page?.toString() || '0')

  const transactions: Transaction[][] = [
    [
      {
        _id: 'algum-id',
        title: 'Compra 1',
        timestamp: 1607360198652,
        amount: 25,
        related: ['P', 'G']
      },
      {
        _id: 'outro-id',
        title: 'Compra 2',
        timestamp: 1607360198652,
        amount: 1500,
        related: ['P', 'G', 'M', 'F']
      }
    ],
    [
      {
        _id: 'terceiro-id',
        title: 'Compra 3',
        timestamp: 1607360198652,
        amount: 10,
        related: ['P', 'F']
      }
    ],
    []
  ]

  return { transactions: transactions[page] }
}

export default Historic
