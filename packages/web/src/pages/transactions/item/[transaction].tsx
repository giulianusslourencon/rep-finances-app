import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import Buttons from '../../../components/buttons'
import Container from '../../../components/container'
import Layout from '../../../components/layout'

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

type TransactionProps = {
  transaction: Transaction
}

const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <Layout>
      <Buttons buttons={[{ title: 'Voltar', href: '/transactions' }]} />
      <Container>
        <h1>{transaction.title}</h1>
      </Container>
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
  TransactionProps,
  { transaction: string }
> = async context => {
  const _id = context.params?.transaction || ''

  const transaction: Transaction = {
    _id,
    title: 'Compra 1',
    timestamp: 1607360198652,
    month: '202012',
    items: {
      item_1: {
        value: 25,
        related_users: ['P', 'G']
      }
    },
    payers: {
      P: 25
    },
    amount: 25,
    related: ['P', 'G']
  }

  return {
    props: {
      transaction
    },
    revalidate: 60
  }
}

export default Transaction
