import { Path } from '@shared/utils'

import { IErrorHandler, InvalidError } from '@errors/contracts'
import { PositiveNumberReason } from '@errors/reasons'

export class Amount {
  constructor(private readonly amount: number) {}

  static create(
    amount: number,
    errorHandler: IErrorHandler,
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
