import { Either, left, right } from '@shared/Either'
import { BalanceProps, IndividualBalanceProps } from '@shared/types/Balance'
import { TransactionCoreProps } from '@shared/types/Transaction'

import { InvalidRelatedError } from '../atomics/errors/InvalidRelated'
import { IndividualBalance } from './IndividualBalance'

export class Balance {
  public individual_balance!: IndividualBalance

  private constructor(individual_balance: IndividualBalance) {
    this.individual_balance = individual_balance
    Object.freeze(this)
  }

  static create(
    transactionOrList:
      | TransactionCoreProps
      | (TransactionCoreProps | IndividualBalanceProps)[]
  ): Either<InvalidRelatedError, Balance> {
    let usersBalance: IndividualBalanceProps

    if (!(transactionOrList instanceof Array)) {
      usersBalance = { ...transactionOrList.payers }

      Object.values(transactionOrList.items).forEach(item => {
        const nUsers = item.related_users.length

        item.related_users.forEach(user => {
          usersBalance[user] = usersBalance[user] || 0
          usersBalance[user] -= item.value / nUsers
        })
      })
    } else {
      const balancesOrError: Either<
        InvalidRelatedError,
        IndividualBalanceProps
      >[] = transactionOrList.map(transactionOrBalance => {
        if ((<IndividualBalanceProps>transactionOrBalance).individual_balance)
          return right(<IndividualBalanceProps>transactionOrBalance)
        const balanceOrError = Balance.create(
          <TransactionCoreProps>transactionOrBalance
        )
        if (balanceOrError.isLeft()) return left(balanceOrError.value)
        return right(balanceOrError.value.individual_balance.value)
      })

      for (const balanceOrError of balancesOrError) {
        if (balanceOrError.isLeft()) return left(balanceOrError.value)
      }

      const balances = balancesOrError.map(
        balanceOrError => <IndividualBalanceProps>balanceOrError.value
      )

      usersBalance = balances.reduce<IndividualBalanceProps>((acc, cur) => {
        for (const [user, user_balance] of Object.entries(cur)) {
          acc[user] = acc[user] || 0
          acc[user] += user_balance
        }
        return acc
      }, {})
    }

    Object.keys(usersBalance).forEach(user => {
      if (!usersBalance[user]) delete usersBalance[user]
    })

    const individualBalanceOrError = IndividualBalance.create(usersBalance)

    if (individualBalanceOrError.isLeft())
      return left(individualBalanceOrError.value)

    return right(new Balance(individualBalanceOrError.value))
  }

  get value(): BalanceProps {
    return { individual_balance: this.individual_balance.value }
  }
}
