import { Amount, UserId } from '@entities/components'
import { InvalidError, InvalidFields } from '@entities/errors'
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
  ): Either<InvalidFields, TransactionPayers> {
    const finalList: ValidatedPayers = []
    const errors: InvalidFields = []
    for (const [userId, amount] of Object.entries(payers)) {
      const userIdOrError = UserId.create(userId)
      const amountOrError = Amount.create(amount)

      if (userIdOrError.isLeft())
        errors.push({
          field: `${userId}.userId`,
          error: userIdOrError.value
        })
      if (amountOrError.isLeft())
        errors.push({
          field: `${userId}.amount`,
          error: amountOrError.value
        })

      const duplicated = finalList.filter(
        item => item[0].value === userIdOrError.value.value
      )
      if (duplicated.length > 0)
        errors.push({
          field: userId,
          error: new InvalidError(
            'Transaction Payers',
            userIdOrError.value.value,
            new DuplicateReason('id')
          )
        })

      if (errors.length === 0)
        finalList.push([
          userIdOrError.value as UserId,
          amountOrError.value as Amount
        ])
    }

    if (errors.length === 0 && !TransactionPayers.validate(finalList))
      errors.push({
        error: new InvalidError('Transaction Payers', '', new EmptyReason())
      })

    if (errors.length > 0) return left(errors)

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
