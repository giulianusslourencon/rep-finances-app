type Transaction = {
  title: string
  timestamp: number
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
  if (!validateItems(transaction.items)) return false
  if (!validatePayers(transaction.payers)) return false

  const itemsValues = Object.values(transaction.items).reduce((acc, cur) => {
    return acc + cur.amount
  }, 0)

  const totalPaid = Object.values(transaction.payers).reduce((acc, cur) => {
    return acc + cur
  }, 0)

  if (itemsValues !== totalPaid) {
    return false
  }
  if (itemsValues === 0) {
    return false
  }

  return true
}

const validateLabel = (label: string) => {
  return label.trim().length >= 2 && label.trim().length <= 255
}

const validateAmount = (amount: number) => {
  return amount > 0
}

const validateRelatedList = (relatedList: string[]) => {
  if (relatedList.length === 0) return false
  for (const userId of relatedList) {
    if (!validateUserId(userId)) return false
  }
  return true
}

const validateUserId = (userId: string) => {
  const tester = /^[a-zA-Z][a-zA-Z0-9]?/
  if (!userId || userId.trim().length < 1 || userId.trim().length > 2) {
    return false
  }
  if (!tester.test(userId)) {
    return false
  }
  return true
}

const validateItems = (items: TransactionItems) => {
  for (const [itemName, { related_users, amount }] of Object.entries(items)) {
    if (!validateLabel(itemName)) return false
    if (!validateRelatedList(related_users)) return false
    if (!validateAmount(amount)) return false
  }
  return true
}

const validatePayers = (payers: TransactionPayers) => {
  for (const [userId, amount] of Object.entries(payers)) {
    if (!validateUserId(userId)) return false
    if (!validateAmount(amount)) return false
  }
  return true
}
