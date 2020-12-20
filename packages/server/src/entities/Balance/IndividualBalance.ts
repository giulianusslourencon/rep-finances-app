import { Either, left, right } from '@shared/Either'
import { IndividualBalanceProps } from '@shared/types/Balance'

import { InvalidRelatedError } from '../atomics/errors/InvalidRelated'
import { Related } from '../atomics/Related'

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
