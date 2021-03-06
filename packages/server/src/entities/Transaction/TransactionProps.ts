export type TransactionInitProps = {
  title: string
  timestamp: number
  items: TransactionItemsProps
  payers: TransactionPayersProps
}

export type TransactionProps = {
  _id: string
  title: string
  date: Date
  month: string
  items: TransactionItemsProps
  payers: TransactionPayersProps
  amount: number
  related: string[]
}

export type TransactionItemsProps = {
  [name: string]: {
    amount: number
    related_users: string[]
  }
}

export type TransactionPayersProps = {
  [userId: string]: number
}
