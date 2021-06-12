import { Button, StackDivider, VStack } from '@chakra-ui/react'
import { Formik, FormikHelpers, Form, FieldArray } from 'formik'
import Router from 'next/router'
import React from 'react'

import { Layout } from '@modules/page'

import API from '@utils/api'
import { Transaction } from '@utils/types'

import {
  TransactionInfoProps,
  TransactionInfoSection
} from './TransactionInfoSection'
import {
  getBaseItem,
  TransactionItemForm,
  TransactionItemsSection
} from './TransactionItemsSection'
import {
  TransactionPayerForm,
  TransactionPayersSection
} from './TransactionPayersSection'

type TransactionFormProps = {
  info: TransactionInfoProps
  items: TransactionItemForm[]
  related: TransactionPayerForm[]
}

export const NewTransactionPage: React.FC = () => {
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
        {props => (
          <Form>
            <VStack
              divider={<StackDivider borderColor="purple.800" />}
              spacing={2}
              align="stretch"
            >
              <TransactionInfoSection setFieldValue={props.setFieldValue} />
              <FieldArray
                name="related"
                render={relatedArrayHelper => (
                  <TransactionItemsSection
                    items={props.values.items}
                    setFieldValue={props.setFieldValue}
                    related={props.values.related.map(user => user.userId)}
                    addRelated={user => {
                      user = user.trim().toUpperCase()
                      const indexToInsert = props.values.related.filter(
                        u => u.userId < user
                      ).length
                      relatedArrayHelper.insert(indexToInsert, {
                        userId: user,
                        amount: 0
                      })
                    }}
                  />
                )}
              />
              <TransactionPayersSection
                payers={props.values.related}
                setFieldValue={props.setFieldValue}
                amountDiff={(function () {
                  const itemsValues = props.values.items.reduce(
                    (acc, cur) => acc + cur.quantity * cur.price,
                    0
                  )
                  const totalPaid = props.values.related.reduce(
                    (acc, cur) => acc + cur.amount,
                    0
                  )
                  return itemsValues - totalPaid
                })()}
              />
              <Button
                isLoading={props.isSubmitting}
                loadingText="Criando..."
                isDisabled={props.isSubmitting || !props.isValid}
                type="submit"
              >
                Criar Transação
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}
