import { InvalidUserIdError } from '@entities/atomics/errors'
import { Balance, BalanceProps, TransactionCoreProps } from '@entities/Balance'

import { Either } from '@shared/Either'

export class BalanceFromTransactionCore {
  static create(
    transaction: TransactionCoreProps
  ): Either<InvalidUserIdError, Balance> {
    const usersBalance: BalanceProps = {
      individual_balance: { ...transaction.payers }
    }

    Object.values(transaction.items).forEach(item => {
      const nUsers = item.related_users.length

      item.related_users.forEach(user => {
        usersBalance.individual_balance[user] =
          usersBalance.individual_balance[user] || 0
        usersBalance.individual_balance[user] -= item.amount / nUsers
      })
    })

    return Balance.create(usersBalance)
  }
}
