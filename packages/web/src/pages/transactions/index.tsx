import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@chakra-ui/icons'
import {
  Flex,
  HStack,
  IconButton,
  Link,
  StackDivider,
  Text,
  VStack
} from '@chakra-ui/react'
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
import { ErrorResponse, TransactionList } from '@utils/types'

type Props = {
  error?: ErrorResponse
  transactions: TransactionList
  paginationProps: {
    itemsCount: number
    curPage: number
    firstIndex: number
    lastIndex: number
  }
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

const Historic: NextPage<Props> = ({
  error,
  transactions,
  paginationProps
}) => {
  return (
    <Layout
      buttons={[
        { title: 'Voltar', href: '/' },
        { title: 'Adicionar', href: '/transactions/new' }
      ]}
      footer={
        <Flex flexGrow={1} justify="space-between" align="center">
          <HStack>
            <NextLink href="/transactions?page=1">
              <IconButton
                variant="ghost"
                color="white"
                colorScheme="whiteAlpha"
                aria-label="Primeira"
                icon={<ArrowLeftIcon />}
                disabled={paginationProps.curPage === 1}
              />
            </NextLink>
            <NextLink
              href={`/transactions?page=${paginationProps.curPage - 1}`}
            >
              <IconButton
                variant="ghost"
                color="white"
                colorScheme="whiteAlpha"
                aria-label="Anterior"
                icon={<ChevronLeftIcon />}
                disabled={paginationProps.curPage === 1}
              />
            </NextLink>
          </HStack>
          <Text color="white">
            {`${paginationProps.firstIndex}-${paginationProps.lastIndex}/${paginationProps.itemsCount}`}
          </Text>
          <HStack>
            <NextLink
              href={`/transactions?page=${paginationProps.curPage + 1}`}
            >
              <IconButton
                variant="ghost"
                color="white"
                colorScheme="whiteAlpha"
                aria-label="Próxima"
                icon={<ChevronRightIcon />}
                disabled={
                  paginationProps.lastIndex >= paginationProps.itemsCount
                }
              />
            </NextLink>
            <NextLink
              href={`/transactions?page=${
                Math.floor((paginationProps.itemsCount - 1) / 15) + 1
              }`}
            >
              <IconButton
                variant="ghost"
                color="white"
                colorScheme="whiteAlpha"
                aria-label="Última"
                icon={<ArrowRightIcon />}
                disabled={
                  paginationProps.lastIndex >= paginationProps.itemsCount
                }
              />
            </NextLink>
          </HStack>
        </Flex>
      }
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

  const itemsPerPage = 15

  const props: Props = {
    transactions: [],
    paginationProps: {
      curPage: page,
      itemsCount: 0,
      firstIndex: (page - 1) * itemsPerPage + 1,
      lastIndex: 15
    }
  }

  try {
    const countResponse = await API.countTransactions()
    props.paginationProps.itemsCount = countResponse.data.count
    props.paginationProps.lastIndex = Math.min(
      props.paginationProps.itemsCount,
      props.paginationProps.firstIndex + itemsPerPage - 1
    )

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
