import { UserId } from '@entities/components'
import { InvalidFields } from '@entities/errors'

import { Either, left, right } from '@shared/types'

export type IndividualBalanceProps = {
  [userId: string]: number
}

type ValidatedBalance = [UserId, number][]

export class IndividualBalance {
  private readonly balance: ValidatedBalance

  private constructor(balance: ValidatedBalance) {
    this.balance = [...balance]
    Object.freeze(this)
  }

  static create(
    balance: IndividualBalanceProps
  ): Either<InvalidFields, IndividualBalance> {
    const finalList: ValidatedBalance = []
    const errors: InvalidFields = []
    for (const [userId, amount] of Object.entries(balance)) {
      const userIdOrError = UserId.create(userId)

      if (userIdOrError.isLeft())
        errors.push({
          field: userId,
          error: userIdOrError.value
        })
      else finalList.push([userIdOrError.value, amount])
    }
    if (errors.length > 0) return left(errors)
    return right(new IndividualBalance(finalList))
  }

  get value(): IndividualBalanceProps {
    const balance: IndividualBalanceProps = {}
    for (const [userId, amount] of this.balance) {
      balance[userId.value] = amount
    }
    return balance
  }
}
