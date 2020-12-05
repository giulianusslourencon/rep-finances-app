import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import Layout from '../../../components/layout'

type TransactionProps = {
  transaction: {
    _id: string
    title: string
    amount: number
  }
}

const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <Layout>
      <h1>{transaction.title}</h1>
      <p>{transaction.amount}</p>
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

  const transaction = {
    _id,
    title: 'Compra 1',
    amount: 50
  }

  return {
    props: {
      transaction
    },
    revalidate: 60
  }
}

export default Transaction
