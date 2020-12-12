import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import Layout from '@components/layout'
import TransactionData from '@components/transactionData'
import TransactionItemsList from '@components/transactionItemsList'

type Transaction = {
  _id: string
  title: string
  amount: number
  timestamp: number
  month: string
  items: {
    [title: string]: {
      value: number
      related_users: string[]
    }
  }
  payers: {
    [user_id: string]: number
  }
  related: string[]
}

type Balance = {
  [user_id: string]: number
}

type Props = {
  transaction: Transaction
  balance: Balance
}

const Transaction: React.FC<Props> = ({ transaction, balance }) => {
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Carregando...</p>
  }

  const date = new Date(transaction.timestamp)
  const formattedDate = date.toLocaleString('pt-BR')

  const individual_payment = transaction.related.map(id => {
    return {
      id,
      value: transaction.payers[id] || 0
    }
  })

  const individual_balance = transaction.related.map(id => {
    return {
      id,
      value: balance[id] || 0
    }
  })

  const individual_amount = transaction.related.map((id, index) => {
    return {
      id,
      value: individual_payment[index].value - individual_balance[index].value
    }
  })

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/transactions' }]}>
      <section id="transaction_header">
        <span id="transaction_header_title">{transaction.title}</span>
        <span id="transaction_header_date_time">{formattedDate}</span>
      </section>
      <hr />
      <section id="transaction_values">
        <div id="transaction_amount">
          Valor Total da Compra: <span>R$ {transaction.amount.toFixed(2)}</span>
        </div>
        <TransactionData data={individual_amount}>
          Valor Individual:
        </TransactionData>
        <TransactionData data={individual_payment}>
          Pagamento Individual:
        </TransactionData>
        <TransactionData data={individual_balance}>
          Agiotagem Final:
        </TransactionData>
      </section>
      <hr />
      <section id="transaction_items_details">
        <TransactionItemsList items={Object.entries(transaction.items)} />
      </section>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [{ params: { transaction: 'id-teste' } }]

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

  const transaction: Transaction = {
    _id,
    title: 'Compra 1',
    timestamp: 1607360198652,
    month: '202012',
    items: {
      'item 1 da compra 1': {
        value: 15,
        related_users: ['P', 'G', 'F']
      },
      'item 2 da compra 1': {
        value: 10,
        related_users: ['P', 'G']
      }
    },
    payers: {
      P: 25
    },
    amount: 25,
    related: ['P', 'G', 'F']
  }

  const balance: Balance = {
    P: 15,
    G: -10,
    F: -5
  }

  return {
    props: {
      transaction,
      balance
    },
    revalidate: 60
  }
}

export default Transaction
