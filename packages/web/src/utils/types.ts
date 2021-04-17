export type ErrorResponse = {
  name: string
  errors: {
    message: string
    field?: string
  }[]
}

export type Transaction = {
  title: string
  timestamp: number
  items: {
    [name: string]: {
      amount: number
      related_users: string[]
    }
  }
  payers: {
    [userId: string]: number
  }
}

type TransactionListItem = {
  _id: string
  title: string
  date: string
  amount: number
  related: string[]
}

export type TransactionList = TransactionListItem[]

export type Balance = {
  balance: {
    [userId: string]: number
  }
}

export type TransactionDetails = Balance & {
  transaction: Transaction & TransactionListItem & { month: string }
}

export type Count = {
  count: number
}
