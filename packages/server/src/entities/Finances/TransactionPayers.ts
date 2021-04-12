import { Amount, UserId } from '@entities/components'
import { EntityErrorHandler, InvalidError } from '@entities/errors'
import { DuplicateReason, EmptyReason } from '@entities/errors/reasons'

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
    payers: TransactionPayersProps,
    errorHandler: EntityErrorHandler,
    path = ''
  ): TransactionPayers {
    const finalList: ValidatedPayers = []
    for (const [user, amount] of Object.entries(payers)) {
      const userId = UserId.create(user, errorHandler, `${path}.${user}.userId`)
      const userAmount = Amount.create(
        amount,
        errorHandler,
        `${path}.${user}.amount`
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
          `${path}.${user}`
        )

      finalList.push([userId, userAmount])
    }

    if (!TransactionPayers.validate(finalList))
      errorHandler.addError(
        new InvalidError('Transaction Payers', '', new EmptyReason()),
        path
      )

    return new TransactionPayers(finalList)
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
