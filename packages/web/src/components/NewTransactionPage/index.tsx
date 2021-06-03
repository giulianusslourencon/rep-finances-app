import { Button, StackDivider, VStack } from '@chakra-ui/react'
import { Formik, FormikHelpers, Form } from 'formik'
import React from 'react'

import { Layout } from '@modules/page'

import {
  TransactionInfoProps,
  TransactionInfoSection
} from './TransactionInfoSection'

type TransactionItemForm = {
  itemName: string
  amount: [number, number]
  related_users: string[]
}

type TransactionPayerForm = {
  userId: string
  amount: number
}

type TransactionFormProps = {
  info: TransactionInfoProps
  items: TransactionItemForm[]
  payers: TransactionPayerForm[]
}

export const NewTransactionPage: React.FC = () => {
  const baseItem: TransactionItemForm = {
    itemName: '',
    related_users: [],
    amount: [1, 0]
  }

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <Formik
        initialValues={{
          info: {
            title: '',
            timestamp: Date.now()
          },
          items: [{ ...baseItem }],
          payers: [] as TransactionPayerForm[]
        }}
        onSubmit={(
          values: TransactionFormProps,
          { setSubmitting }: FormikHelpers<TransactionFormProps>
        ) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 500)
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
