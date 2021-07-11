import { VStack, StackDivider, Button } from '@chakra-ui/react'
import { Form } from 'formik'
import React from 'react'

import { ITransactionForm, TransactionInfoSection } from '@components/forms'
import { TransferFormProps } from '@components/pages/NewTransferPage'

import { TransferDataSection } from './TransferDataSection'

export const TransferTransactionForm: ITransactionForm<TransferFormProps> =
  props => (
    <Form>
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing={2}
        align="stretch"
      >
        <TransactionInfoSection setFieldValue={props.setFieldValue} />
        <TransferDataSection
          setFieldValue={props.setFieldValue}
          related={props.values.related}
          payer={props.values.transfer.payer}
          receiver={props.values.transfer.receiver}
        />
        <Button
          isLoading={props.isSubmitting}
          loadingText="Criando..."
          isDisabled={props.isSubmitting || !props.isValid}
          type="submit"
        >
          Criar Transferência
        </Button>
      </VStack>
    </Form>
  )
