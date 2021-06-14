import { Formik, FormikHelpers } from 'formik'
import Router from 'next/router'
import React from 'react'

import { TransactionFormProps } from '@components/forms'
import { getBaseItem } from '@components/forms/DefaultTransactionForm/TransactionItemsSection'
import { TransferTransactionForm } from '@components/forms/TransferTransactionForm'

import { Layout } from '@modules/page'

import API from '@utils/api'
import { Transaction } from '@utils/types'

export const NewTransferPage: React.FC = () => {
  const formatTransaction = (
    transaction: TransactionFormProps
  ): Transaction => {
    const objItems = {} as Transaction['items']
    transaction.items.map(
      item =>
        (objItems[item.itemName] = {
          amount: (item.quantity * item.price) / 100,
          related_users: item.related_users
        })
    )

    const objPayers = {} as Transaction['payers']
    transaction.related.forEach(payer => {
      if (payer.amount) objPayers[payer.userId] = payer.amount / 100
    })

    const { title, timestamp } = transaction.info

    return {
      title,
      timestamp: timestamp,
      items: objItems,
      payers: objPayers
    }
  }

  const initialUsers = ['D', 'F', 'G', 'M', 'P']

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <Formik
        initialValues={{
          info: {
            title: '',
            timestamp: Date.now()
          },
          items: [getBaseItem()],
          related: initialUsers
            .sort()
            .map(user => ({ userId: user, amount: 0 }))
        }}
        onSubmit={async (
          values: TransactionFormProps,
          { setSubmitting }: FormikHelpers<TransactionFormProps>
        ) => {
          try {
            const response = await API.createTransaction(
              formatTransaction(values)
            )
            Router.push(`/transactions/item/${response.data._id}`)
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
