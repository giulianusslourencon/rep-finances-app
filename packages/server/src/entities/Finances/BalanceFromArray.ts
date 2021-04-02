import { InvalidFields } from '@entities/errors'
import {
  Balance,
  BalanceFromTransactionCore,
  BalanceProps,
  TransactionCoreProps
} from '@entities/Finances'

import { Either, left, right } from '@shared/types'

export class BalanceFromArray {
  static create(
    transactionsOrBalances: (TransactionCoreProps | BalanceProps)[]
  ): Either<InvalidFields, Balance> {
    const balancesOrError: Either<
      InvalidFields,
      BalanceProps
    >[] = transactionsOrBalances.map(transactionOrBalance => {
      if ((<BalanceProps>transactionOrBalance).individual_balance)
        return right(<BalanceProps>transactionOrBalance)
      const balanceOrError = BalanceFromTransactionCore.create(
        <TransactionCoreProps>transactionOrBalance
      )
      if (balanceOrError.isLeft()) return left(balanceOrError.value)
      return right(balanceOrError.value.value)
    })

    const balancesErrors = balancesOrError.filter(balanceOrError =>
      balanceOrError.isLeft()
    )
    const errors = balancesErrors
      .map(balanceError => balanceError.value as InvalidFields)
      .reduce((acc, cur) => acc.concat(cur), [])

    if (errors.length > 0) return left(errors)

    const balances = balancesOrError.map(
      balanceOrError => <BalanceProps>balanceOrError.value
    )

    const usersBalance = balances.reduce<BalanceProps>(
      (acc, cur) => {
        for (const [userId, user_balance] of Object.entries(
          cur.individual_balance
        )) {
          acc.individual_balance[userId] = acc.individual_balance[userId] || 0
          acc.individual_balance[userId] += user_balance
        }
        return acc
      },
      { individual_balance: {} }
    )

    return Balance.create(usersBalance)
  }
}
