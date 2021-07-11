import { Form, FormikProps } from 'formik'

export type TransactionInfoProps = {
  title: string
  timestamp: number
}

export type TransactionItemForm = {
  itemName: string
  price: number
  quantity: number
  related_users: string[]
}

export type TransactionPayerForm = {
  userId: string
  amount: number
}

export type TransactionFormProps = {
  info: TransactionInfoProps
  items: TransactionItemForm[]
  related: TransactionPayerForm[]
}

export type ITransactionForm<Props = TransactionFormProps> = (
  props: FormikProps<Props>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
) => Form
