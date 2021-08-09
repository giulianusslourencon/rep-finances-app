import { Path } from '@shared/utils'

import { IErrorHandler, InvalidError } from '@errors/contracts'

import { Amount, UserId } from '@entities/components'
import { DuplicateReason, EmptyReason } from '@entities/errors/reasons'

type ValidatedPayers = [UserId, Amount][]

export type TransactionPayersProps = {
  [userId: string]: number
}

export class TransactionPayers {
  constructor(private readonly payers: TransactionPayersProps) {}

  static create(
    payers: TransactionPayersProps,
    errorHandler: IErrorHandler,
    path = new Path()
  ): TransactionPayers {
    const finalList: ValidatedPayers = []
    for (const [user, amount] of Object.entries(payers)) {
      const userId = UserId.create(
        user,
        errorHandler,
        path.add(`${user}.userId`)
      )
      const userAmount = Amount.create(
        amount,
        errorHandler,
        path.add(user, 'amount')
      )

      const duplicated = finalList.filter(
        item => item[0].value === userId.value
      )
      if (duplicated.length > 0)
        errorHandler.addError(
          new InvalidError(
            'Transaction Payers',
            userId.value,
            new DuplicateReason('id')
          ),
          path.add(user).resolve()
        )

      finalList.push([userId, userAmount])
    }

    if (!TransactionPayers.validate(finalList)) {
      errorHandler.addError(
        new InvalidError('Transaction Payers', '', new EmptyReason()),
        path.resolve()
      )
    }

    const validatedPayers: TransactionPayersProps = {}
    for (const [userId, amount] of finalList) {
      validatedPayers[userId.value] = amount.value
    }

    return new TransactionPayers(validatedPayers)
  }

  get value(): TransactionPayersProps {
    return this.payers
  }

  get totalPaid(): number {
    return Object.entries(this.payers).reduce((acc, cur) => {
      return acc + cur[1]
    }, 0)
  }

  private static validate(payers: ValidatedPayers): boolean {
    return payers.length > 0
  }
}
