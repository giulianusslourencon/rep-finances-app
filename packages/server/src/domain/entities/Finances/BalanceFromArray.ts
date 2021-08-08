import { Path } from '@shared/utils'

import { EntityErrorHandler } from '@entities/errors'
import {
  Balance,
  BalanceFromTransactionCore,
  BalanceProps,
  TransactionCoreProps
} from '@entities/Finances'

export class BalanceFromArray {
  static create(
    transactionsOrBalances: (TransactionCoreProps | BalanceProps)[],
    errorHandler: EntityErrorHandler,
    path = new Path()
  ): Balance {
    const balances: BalanceProps[] = transactionsOrBalances.map(
      transactionOrBalance => {
        if ((<BalanceProps>transactionOrBalance).individual_balance)
          return <BalanceProps>transactionOrBalance
        const balance = BalanceFromTransactionCore.create(
          <TransactionCoreProps>transactionOrBalance,
          errorHandler,
          path
        )
        return balance.value
      }
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

    return Balance.create(usersBalance, errorHandler, path)
  }
}
