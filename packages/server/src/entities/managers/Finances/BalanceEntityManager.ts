import { Either, left, right } from '@shared/types'

import { EntityErrorHandler, InvalidFields } from '@entities/errors'
import {
  Balance,
  BalanceFromArray,
  BalanceFromTransactionCore,
  BalanceProps,
  TransactionCoreProps
} from '@entities/Finances'

export class BalanceEntityManager {
  static createFromArray(
    props: (TransactionCoreProps | BalanceProps)[]
  ): Either<InvalidFields, Balance> {
    const errorHandler = new EntityErrorHandler()
    const balance = BalanceFromArray.create(props, errorHandler)

    if (errorHandler.hasErrors) return left(errorHandler.errors)
    return right(balance)
  }

  static createFromTransactionCore(
    props: TransactionCoreProps
  ): Either<InvalidFields, Balance> {
    const errorHandler = new EntityErrorHandler()
    const balance = BalanceFromTransactionCore.create(props, errorHandler)

    if (errorHandler.hasErrors) return left(errorHandler.errors)
    return right(balance)
  }
}
