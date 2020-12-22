import { InvalidAmountError } from '@entities/atomics/errors'

import { Either, left, right } from '@shared/Either'

export class Amount {
  private readonly amount: number

  private constructor(amount: number) {
    this.amount = amount
    Object.freeze(this)
  }

  static create(amount: number): Either<InvalidAmountError, Amount> {
    if (!Amount.validate(amount)) {
      return left(new InvalidAmountError(amount.toString()))
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
