import { InvalidError } from '@entities/errors'
import { PositiveNumberReason } from '@entities/errors/reasons'

import { Either, left, right } from '@shared/types'

export class Amount {
  private readonly amount: number

  private constructor(amount: number) {
    this.amount = amount
    Object.freeze(this)
  }

  static create(amount: number): Either<InvalidError, Amount> {
    if (!Amount.validate(amount)) {
      return left(
        new InvalidError(
          'Amount',
          amount.toString(),
          new PositiveNumberReason()
        )
      )
    }
    return right(new Amount(amount))
  }

  get value(): number {
    return this.amount
  }

  static validate(amount: number): boolean {
    if (!amount || amount <= 0) {
      return false
    }
    return true
  }
}
