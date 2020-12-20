export type TransactionItemsProps = {
  [title: string]: {
    value: number
    related_users: string[]
  }
}

export type TransactionPayersProps = {
  [user: string]: number
}

export type TransactionProps = {
  _id: string
  title: string
  timestamp: number | string
  month: string
  items: TransactionItemsProps
  payers: TransactionPayersProps
  amount: number
  related: string[]
}

export type TransactionInitProps = Pick<
  TransactionProps,
  'title' | 'timestamp' | 'items' | 'payers'
>

export type TransactionResumeProps = Pick<
  TransactionProps,
  '_id' | 'title' | 'timestamp' | 'amount' | 'related'
>

export type TransactionCoreProps = Pick<TransactionProps, 'items' | 'payers'>
