import { GetStaticPaths, GetStaticProps } from 'next'

import {
  TransactionDetailsPageProps,
  TransactionDetailsPage
} from '@components/TransactionDetailsPage'

import API from '@utils/api'

export const getStaticPaths: GetStaticPaths = async () => {
  let paths: { params: { transaction: string } }[] = []
  try {
    const response = await API.listTransactions(1)
    const transactions = response.data

    paths = transactions.map(transaction => {
      return { params: { transaction: transaction._id } }
    })
  } catch (error) {}

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<
  TransactionDetailsPageProps,
  { transaction: string }
> = async context => {
  const _id = context.params?.transaction || ''

  const props: TransactionDetailsPageProps = {
    balance: {},
    transaction: {
      _id: '',
      amount: 0,
      date: Date.now().toString(),
      items: {},
      month: '',
      payers: {},
      related: [],
      title: ''
    }
  }

  try {
    const response = await API.getTransaction(_id)
    const { transaction, balance } = response.data

    props.transaction = { ...transaction, related: transaction.related.sort() }
    props.balance = balance
  } catch (error) {
    const errorMessage = error.response?.data || {
      name: error.code,
      message: error.message
    }
    props.error = errorMessage
  }

  return {
    props
  }
}

export default TransactionDetailsPage
