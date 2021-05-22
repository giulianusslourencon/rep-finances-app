export type CreateTransactionViewModel = {
  title: string
  timestamp: number
  items: TransactionItemsProps
  payers: TransactionPayersProps
}

type TransactionItemsProps = {
  [itemName: string]: {
    amount: number
    related_users: string[]
  }
}

type TransactionPayersProps = {
  [userId: string]: number
}
