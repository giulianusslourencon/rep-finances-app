import { InvalidUserIdError } from '@entities/atomics/errors'
import { BalanceProps, IndividualBalance } from '@entities/Balance'

import { Either, left, right } from '@shared/Either'

export class Balance {
  public individual_balance!: IndividualBalance

  protected constructor(individual_balance: IndividualBalance) {
    this.individual_balance = individual_balance
    Object.freeze(this)
  }

  static create(balance: BalanceProps): Either<InvalidUserIdError, Balance> {
    Object.keys(balance.individual_balance).forEach(userId => {
      if (!balance.individual_balance[userId])
        delete balance.individual_balance[userId]
    })

    const individualBalanceOrError = IndividualBalance.create(
      balance.individual_balance
    )

    if (individualBalanceOrError.isLeft())
      return left(individualBalanceOrError.value)

    return right(new Balance(individualBalanceOrError.value))
  }

  get value(): BalanceProps {
    return { individual_balance: this.individual_balance.value }
  }
}
