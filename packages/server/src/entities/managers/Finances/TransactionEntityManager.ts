import { Either, left, right } from '@shared/types'

import { EntityErrorHandler, InvalidFields } from '@entities/errors'
import { Transaction, TransactionInitProps } from '@entities/Finances'

export class TransactionEntityManager {
  static create(
    props: TransactionInitProps
  ): Either<InvalidFields, Transaction> {
    const errorHandler = new EntityErrorHandler()
    const transaction = Transaction.create(props, errorHandler)

    if (errorHandler.hasErrors) return left(errorHandler.errors)
    return right(transaction)
  }
}
