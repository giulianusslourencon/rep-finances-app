import { StackDivider, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

import { ErrorPopup, Layout } from '@modules/page'

import { ErrorResponse, TransactionDetails } from '@utils/types'

import { PageHeader } from './PageHeader'
import { TransactionItemsSection } from './TransactionItemsSection'
import { TransactionValuesSection } from './TransactionValuesSection'

export type TransactionDetailsPageProps = TransactionDetails & {
  error?: ErrorResponse
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
