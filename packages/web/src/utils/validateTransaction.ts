type Transaction = {
  title: string
  timestamp: number
  items: {
    [x: string]: {
      value: number
      related_users: string[]
    }
  }
  payers: {
    [x: string]: number
  }
}

export const validateTransaction = (transaction: Transaction): boolean => {
  let valid = true
  const itemsValues = Object.values(transaction.items).reduce((acc, cur) => {
    if (cur.value <= 0 || cur.related_users.length === 0) valid = false
    return acc + cur.value
  }, 0)
  const totalPaid = Object.values(transaction.payers).reduce((acc, cur) => {
    if (cur <= 0) valid = false
    return acc + cur
  }, 0)

  if (itemsValues !== totalPaid) {
    return false
  }
  if (itemsValues === 0) {
    return false
  }

  return valid
}
