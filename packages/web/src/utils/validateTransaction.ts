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

type ValidationResult = {
  validated: boolean
  errorMessage?: string
}

export const validateTransaction = (
  transaction: Transaction
): ValidationResult => {
  if (!validateLabel(transaction.title))
    return {
      validated: false,
      errorMessage: 'O título da transação deve ter entre 2 e 255 caracteres'
    }

  for (const [itemName, { related_users, amount }] of Object.entries(
    transaction.items
  )) {
    if (!validateLabel(itemName))
      return {
        validated: false,
        errorMessage:
          'Os títulos de todos os itens devem ter entre 2 e 255 caracteres'
      }
    if (!validateAmount(amount))
      return {
        validated: false,
        errorMessage: 'Todos os valores devem ser maiores do que 0'
      }

    if (related_users.length === 0)
      return {
        validated: false,
        errorMessage: 'Todos os itens devem ter ao menos uma pessoa relacionada'
      }
  }

  const itemsValues = Object.values(transaction.items).reduce((acc, cur) => {
    return acc + cur.amount
  }, 0)

  const totalPaid = Object.values(transaction.payers).reduce((acc, cur) => {
    return acc + cur
  }, 0)

  if (itemsValues.toFixed(2) !== totalPaid.toFixed(2)) {
    return {
      validated: false,
      errorMessage: `Valor total dos itens (R$ ${itemsValues.toFixed(
        2
      )}) não corresponde ao total pago (R$ ${totalPaid.toFixed(2)})`
    }
  }

  return { validated: true }
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
