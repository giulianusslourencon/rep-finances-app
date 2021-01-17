type Transaction = {
  title: string
  timestamp: number | string | Date
  items: TransactionItems
  payers: TransactionPayers
}

type TransactionItems = {
  [itemName: string]: {
    amount: number
    related_users: string[]
  }
}

type TransactionPayers = {
  [userId: string]: number
}

export const validateTransaction = (transaction: Transaction): boolean => {
  if (!validateLabel(transaction.title)) return false

  for (const [itemName, { related_users, amount }] of Object.entries(
    transaction.items
  )) {
    if (!validateLabel(itemName)) return false
    if (!validateAmount(amount)) return false

    if (related_users.length === 0) return false
  }

  const itemsValues = Object.values(transaction.items).reduce((acc, cur) => {
    return acc + cur.amount
  }, 0)

  const totalPaid = Object.values(transaction.payers).reduce((acc, cur) => {
    return acc + cur
  }, 0)

  if (itemsValues.toFixed(2) !== totalPaid.toFixed(2)) {
    return false
  }

  return true
}

export const validateLabel = (label: string) => {
  return label.trim().length >= 2 && label.trim().length <= 255
}

export const validateAmount = (amount: number) => {
  return amount > 0
}

export const validateUserId = (userId: string) => {
  const tester = /^[a-zA-Z][a-zA-Z0-9]?$/
  if (!userId || userId.trim().length < 1 || userId.trim().length > 2) {
    return false
  }
  if (!tester.test(userId)) {
    return false
  }
  return true
}
