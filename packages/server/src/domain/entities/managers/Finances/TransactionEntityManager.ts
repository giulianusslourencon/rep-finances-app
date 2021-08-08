import { Either, left, right } from '@shared/types'

import { EntityErrorHandler, InvalidFields } from '@errors/contracts'

import { Transaction, TransactionProps } from '@entities/Finances'

export class TransactionEntityManager {
  static create(props: TransactionProps): Either<InvalidFields, Transaction> {
    const errorHandler = new EntityErrorHandler()
    const transaction = Transaction.create(props, errorHandler)

    if (errorHandler.hasErrors) return left(errorHandler.errors)
    return right(transaction)
  }
}
