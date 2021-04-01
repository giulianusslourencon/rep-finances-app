import { Amount, UserId } from '@entities/components'
import { InvalidError } from '@entities/errors'
import { DuplicateReason, EmptyReason } from '@entities/errors/reasons'

import { Either, left, right } from '@shared/types'

type ValidatedPayers = [UserId, Amount][]

export type TransactionPayersProps = {
  [userId: string]: number
}

export class TransactionPayers {
  private readonly payers: ValidatedPayers

  private constructor(payers: ValidatedPayers) {
    this.payers = [...payers]
    Object.freeze(this)
  }

  static create(
    payers: TransactionPayersProps
  ): Either<InvalidError, TransactionPayers> {
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
        return left(
          new InvalidError(
            'Transaction Payers',
            userIdOrError.value.value,
            new DuplicateReason('id')
          )
        )

      finalList.push([userIdOrError.value, amountOrError.value])
    }

    if (!TransactionPayers.validate(finalList))
      return left(new InvalidError('Transaction Payers', '', new EmptyReason()))

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
