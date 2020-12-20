import { Either, left, right } from '@shared/Either'

import { Amount } from './Amount'
import { EmptyListError } from './errors/EmptyList'
import { InvalidAmountError } from './errors/InvalidAmount'
import { InvalidRelatedError } from './errors/InvalidRelated'
import { Related } from './Related'

type Payers = {
  [user: string]: number
}

type ValidatedPayers = [Related, Amount][]

export class TransactionPayers {
  private readonly payers: ValidatedPayers

  private constructor(payers: ValidatedPayers) {
    this.payers = [...payers]
    Object.freeze(this)
  }

  static create(
    payers: Payers
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

  get value(): ValidatedPayers {
    return this.payers
  }

  static validate(payers: ValidatedPayers): boolean {
    if (payers.length === 0) return false
    return true
  }
}
