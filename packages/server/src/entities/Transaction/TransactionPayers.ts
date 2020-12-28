import { Amount, UserId } from '@entities/atomics'
import {
  InvalidAmountError,
  InvalidUserIdError
} from '@entities/atomics/errors'
import { TransactionPayersProps } from '@entities/Transaction'
import {
  DuplicatedUserIdOnListError,
  EmptyListError
} from '@entities/Transaction/errors'

import { Either, left, right } from '@shared/Either'

type ValidatedPayers = [UserId, Amount][]

export class TransactionPayers {
  private readonly payers: ValidatedPayers

  private constructor(payers: ValidatedPayers) {
    this.payers = [...payers]
    Object.freeze(this)
  }

  static create(
    payers: TransactionPayersProps
  ): Either<
    InvalidAmountError | InvalidUserIdError | EmptyListError,
    TransactionPayers
  > {
    const finalList: ValidatedPayers = []
    for (const [userId, amount] of Object.entries(payers)) {
      const userIdOrError = UserId.create(userId)
      const amountOrError = Amount.create(amount)

      if (userIdOrError.isLeft()) return left(userIdOrError.value)
      if (amountOrError.isLeft()) return left(amountOrError.value)

      const duplicated = finalList.filter(
        item => item[0].value === userIdOrError.value.value
      )
      if (duplicated.length > 0)
        return left(new DuplicatedUserIdOnListError(userIdOrError.value.value))

      finalList.push([userIdOrError.value, amountOrError.value])
    }

    if (!TransactionPayers.validate(finalList))
      return left(new EmptyListError())

    return right(new TransactionPayers(finalList))
  }

  get value(): TransactionPayersProps {
    const payers: TransactionPayersProps = {}
    for (const [userId, amount] of this.payers) {
      payers[userId.value] = amount.value
    }
    return payers
  }

  static validate(payers: ValidatedPayers): boolean {
    if (payers.length === 0) return false
    return true
  }
}
