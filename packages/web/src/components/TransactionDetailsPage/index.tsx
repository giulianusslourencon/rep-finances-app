import { StackDivider, VStack } from '@chakra-ui/react'
import { Layout } from '@modules'
import { useRouter } from 'next/router'
import React from 'react'

import ErrorPopup from '@components/ErrorPopup'

import { ErrorResponse } from '@utils/types'

import { PageHeader } from './PageHeader'
import { TransactionItemsSection } from './TransactionItemsSection'
import { TransactionValuesSection } from './TransactionValuesSection'

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

export type TransactionDetailsPageProps = {
  error?: ErrorResponse
  transaction: Transaction
  balance: Balance
}

export const TransactionDetailsPage: React.FC<TransactionDetailsPageProps> = ({
  error,
  transaction,
  balance
}) => {
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/transactions' }]}>
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing={2}
        align="stretch"
      >
        {error && <ErrorPopup error={error} />}
        <PageHeader title={transaction.title} date={transaction.date} />
        <TransactionValuesSection
          amount={transaction.amount}
          related={transaction.related}
          balance={balance}
          payers={transaction.payers}
        />
        <TransactionItemsSection items={transaction.items} />
      </VStack>
    </Layout>
  )
}
