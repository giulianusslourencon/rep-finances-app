import { VStack, StackDivider, Flex } from '@chakra-ui/react'
import React from 'react'

import { Layout, ErrorPopup } from '@modules/page'
import { IdBox, Cash } from '@modules/resource'

import { ErrorResponse } from '@utils/types'

export type BalancePageProps = {
  error?: ErrorResponse
  balance: [string, number][]
}

export const BalancePage: React.FC<BalancePageProps> = ({ error, balance }) => {
  return (
    <Layout
      buttons={[
        { title: 'Histórico', href: '/transactions' },
        { title: 'Adicionar', href: '/transactions/new' }
      ]}
    >
      {error && <ErrorPopup error={error} />}
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing={2}
        align="stretch"
      >
        {balance
          .sort((a, b) => {
            if (a[0] < b[0]) return -1
            if (a[0] > b[0]) return 1
            return 0
          })
          .map(user => (
            <Flex key={user[0]} justify="space-between" align="center">
              <IdBox userId={user[0]} size="lg" />
              <Cash amount={user[1]} fontSize="3xl" variant="dark" />
            </Flex>
          ))}
      </VStack>
    </Layout>
  )
}
