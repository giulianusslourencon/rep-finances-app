import { Related } from '@entities/atomics'
import { InvalidRelatedError } from '@entities/atomics/errors'
import { IndividualBalanceProps } from '@entities/Balance'

import { Either, left, right } from '@shared/Either'

type ValidatedBalance = [Related, number][]

export class IndividualBalance {
  private readonly balance: ValidatedBalance

  private constructor(balance: ValidatedBalance) {
    this.balance = [...balance]
    Object.freeze(this)
  }

  static create(
    balance: IndividualBalanceProps
  ): Either<InvalidRelatedError, IndividualBalance> {
    const finalList: ValidatedBalance = []
    for (const [user, amount] of Object.entries(balance)) {
      const userOrError = Related.create(user)

      if (userOrError.isLeft()) return left(userOrError.value)

      finalList.push([userOrError.value, amount])
    }
    return right(new IndividualBalance(finalList))
  }

  get value(): IndividualBalanceProps {
    const balance: IndividualBalanceProps = {}
    for (const [user, amount] of this.balance) {
      balance[user.value] = amount
    }
    return balance
  }
}
