import { InvalidRelatedError } from '@entities/atomics/errors'
import {
  BalanceProps,
  IndividualBalance,
  TransactionCoreProps
} from '@entities/Balance'

import { Either, left, right } from '@shared/Either'

export class Balance {
  public individual_balance!: IndividualBalance

  private constructor(individual_balance: IndividualBalance) {
    this.individual_balance = individual_balance
    Object.freeze(this)
  }

  static create(
    transactionOrList:
      | TransactionCoreProps
      | (TransactionCoreProps | BalanceProps)[]
  ): Either<InvalidRelatedError, Balance> {
    let usersBalance: BalanceProps = { individual_balance: {} }

    if (!(transactionOrList instanceof Array)) {
      usersBalance.individual_balance = { ...transactionOrList.payers }

      Object.values(transactionOrList.items).forEach(item => {
        const nUsers = item.related_users.length

        item.related_users.forEach(user => {
          usersBalance.individual_balance[user] =
            usersBalance.individual_balance[user] || 0
          usersBalance.individual_balance[user] -= item.value / nUsers
        })
      })
    } else {
      const balancesOrError: Either<
        InvalidRelatedError,
        BalanceProps
      >[] = transactionOrList.map(transactionOrBalance => {
        if ((<BalanceProps>transactionOrBalance).individual_balance)
          return right(<BalanceProps>transactionOrBalance)
        const balanceOrError = Balance.create(
          <TransactionCoreProps>transactionOrBalance
        )
        if (balanceOrError.isLeft()) return left(balanceOrError.value)
        return right(balanceOrError.value.value)
      })

      for (const balanceOrError of balancesOrError) {
        if (balanceOrError.isLeft()) return left(balanceOrError.value)
      }

      const balances = balancesOrError.map(
        balanceOrError => <BalanceProps>balanceOrError.value
      )

      usersBalance = balances.reduce<BalanceProps>(
        (acc, cur) => {
          for (const [user, user_balance] of Object.entries(
            cur.individual_balance
          )) {
            acc.individual_balance[user] = acc.individual_balance[user] || 0
            acc.individual_balance[user] += user_balance
          }
          return acc
        },
        { individual_balance: {} }
      )
    }

    Object.keys(usersBalance.individual_balance).forEach(user => {
      if (!usersBalance.individual_balance[user])
        delete usersBalance.individual_balance[user]
    })

    const individualBalanceOrError = IndividualBalance.create(
      usersBalance.individual_balance
    )

    if (individualBalanceOrError.isLeft())
      return left(individualBalanceOrError.value)

    return right(new Balance(individualBalanceOrError.value))
  }

  get value(): BalanceProps {
    return { individual_balance: this.individual_balance.value }
  }
}
