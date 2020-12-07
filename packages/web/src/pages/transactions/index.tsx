import { NextPage } from 'next'
import React from 'react'

import Buttons from '../../components/buttons'
import Container from '../../components/container'
import Layout from '../../components/layout'
import TransactionsList from '../../components/transactionsList'

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

const Historic: NextPage<Props> = ({ transactions }) => {
  return (
    <Layout>
      <Buttons buttons={[{ title: 'Voltar', href: '/' }]} />
      <Container>
        <TransactionsList transactions={transactions} />
      </Container>
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
    [],
    []
  ]

  return { transactions: transactions[page] }
}

export default Historic
