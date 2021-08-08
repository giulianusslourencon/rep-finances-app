import { EntityErrorHandler, InvalidError } from '@errors/contracts'
import { PositiveNumberReason } from '@errors/reasons'

import { Path } from '@shared/utils'

export class Amount {
  constructor(private readonly amount: number) {}

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

  private static validate(amount: number): boolean {
    return !(!amount || amount <= 0)
  }
}
