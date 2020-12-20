import { Either, left, right } from '@shared/Either'
import { TransactionPayersProps } from '@shared/types/Transaction'

import { Amount } from '../atomics/Amount'
import { InvalidAmountError } from '../atomics/errors/InvalidAmount'
import { InvalidRelatedError } from '../atomics/errors/InvalidRelated'
import { Related } from '../atomics/Related'
import { EmptyListError } from './errors/EmptyList'

type ValidatedPayers = [Related, Amount][]

export class TransactionPayers {
  private readonly payers: ValidatedPayers

  private constructor(payers: ValidatedPayers) {
    this.payers = [...payers]
    Object.freeze(this)
  }

  static create(
    payers: TransactionPayersProps
  ): Either<
    InvalidAmountError | InvalidRelatedError | EmptyListError,
    TransactionPayers
  > {
    const finalList: ValidatedPayers = []
    for (const [user, amount] of Object.entries(payers)) {
      const userOrError = Related.create(user)
      const amountOrError = Amount.create(amount)

      if (userOrError.isLeft()) return left(userOrError.value)
      if (amountOrError.isLeft()) return left(amountOrError.value)

      finalList.push([userOrError.value, amountOrError.value])
    }

    if (!TransactionPayers.validate(finalList))
      return left(new EmptyListError())

    return right(new TransactionPayers(finalList))
  }

  get value(): TransactionPayersProps {
    const payers: TransactionPayersProps = {}
    for (const [user, amount] of this.payers) {
      payers[user.value] = amount.value
    }
    return payers
  }

  static validate(payers: ValidatedPayers): boolean {
    if (payers.length === 0) return false
    return true
  }
}
