import { VStack, StackDivider, Button } from '@chakra-ui/react'
import { Form, FieldArray } from 'formik'
import React from 'react'

import { ITransactionForm, TransactionInfoSection } from '@components/forms'

import { TransactionItemsSection } from './TransactionItemsSection'
import { TransactionPayersSection } from './TransactionPayersSection'

export const DefaultTransactionForm: ITransactionForm = props => (
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
)
