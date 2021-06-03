import { Button, StackDivider, VStack } from '@chakra-ui/react'
import { Formik, FormikHelpers, Form, FieldArray } from 'formik'
import React from 'react'

import { Layout } from '@modules/page'

import {
  TransactionInfoProps,
  TransactionInfoSection
} from './TransactionInfoSection'
import {
  getBaseItem,
  TransactionItemForm,
  TransactionItemsSection
} from './TransactionItemsSection'

type TransactionPayerForm = {
  userId: string
  amount: number
}

type TransactionFormProps = {
  info: TransactionInfoProps
  items: TransactionItemForm[]
  payers: TransactionPayerForm[]
  related: string[]
}

export const NewTransactionPage: React.FC = () => {
  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <Formik
        initialValues={{
          info: {
            title: '',
            timestamp: Date.now()
          },
          items: [getBaseItem()],
          payers: [] as TransactionPayerForm[],
          related: [] as string[]
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
              <FieldArray
                name="related"
                render={arrayHelpers => (
                  <TransactionItemsSection
                    items={props.values.items}
                    setFieldValue={props.setFieldValue}
                    related={props.values.related}
                    addRelated={user => {
                      user = user.trim().toUpperCase()
                      const indexToInsert = props.values.related.filter(
                        u => u < user
                      ).length
                      arrayHelpers.insert(indexToInsert, user)
                    }}
                  />
                )}
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
