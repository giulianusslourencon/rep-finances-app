import { Path } from '@shared/utils'

import { EntityErrorHandler, InvalidError } from '@entities/errors'
import { PositiveNumberReason } from '@entities/errors/reasons'

export class Amount {
  private readonly amount: number

  private constructor(amount: number) {
    this.amount = amount
    Object.freeze(this)
  }

  static create(
    amount: number,
    errorHandler: EntityErrorHandler,
    path = new Path()
  ): Amount {
    if (!Amount.validate(amount)) {
      errorHandler.addError(
        new InvalidError(
          'Amount',
          amount.toString(),
          new PositiveNumberReason()
        ),
        path.resolve()
      )
    }
    return new Amount(amount)
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
