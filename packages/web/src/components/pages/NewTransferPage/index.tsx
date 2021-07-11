import { Formik, FormikHelpers } from 'formik'
import Router from 'next/router'
import React from 'react'

import { TransactionInfoProps } from '@components/forms'
import { TransferTransactionForm } from '@components/forms/TransferTransactionForm'

import { Layout } from '@modules/page'

import API from '@utils/api'
import { Transaction } from '@utils/types'

export type TransferFormProps = {
  info: TransactionInfoProps
  transfer: {
    payer: string
    amount: number
    receiver: string
  }
  related: string[]
}

export const NewTransferPage: React.FC = () => {
  const formatTransaction = (transaction: TransferFormProps): Transaction => {
    const { title, timestamp } = transaction.info

    return {
      title,
      timestamp: timestamp,
      items: {
        Valor: {
          amount: transaction.transfer.amount / 100,
          related_users: [transaction.transfer.receiver]
        }
      },
      payers: {
        [`${transaction.transfer.payer}`]: transaction.transfer.amount / 100
      }
    }
  }

  const initialUsers = ['D', 'F', 'G', 'M', 'P']

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <Formik
        initialValues={{
          info: {
            title: 'Transferencia X-Y',
            timestamp: Date.now()
          },
          transfer: {
            payer: '?',
            amount: 0,
            receiver: '?'
          },
          related: initialUsers
        }}
        onSubmit={async (
          values: TransferFormProps,
          { setSubmitting }: FormikHelpers<TransferFormProps>
        ) => {
          try {
            const response = await API.createTransaction(
              formatTransaction(values)
            )
            Router.push(`/transactions/item/${response.data._id}`)
            // console.log(formatTransaction(values))
          } catch (error) {
            alert(error)
          }
          setSubmitting(false)
        }}
      >
        {TransferTransactionForm}
      </Formik>
    </Layout>
  )
}
