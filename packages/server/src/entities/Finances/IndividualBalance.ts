import { UserId } from '@entities/components'
import { InvalidError } from '@entities/errors'

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
  ): Either<InvalidError, IndividualBalance> {
    const finalList: ValidatedBalance = []
    for (const [userId, amount] of Object.entries(balance)) {
      const userIdOrError = UserId.create(userId)

      if (userIdOrError.isLeft()) return left(userIdOrError.value)

      finalList.push([userIdOrError.value, amount])
    }
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
