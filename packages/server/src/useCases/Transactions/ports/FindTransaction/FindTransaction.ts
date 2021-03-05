import { TransactionProps } from '@entities/Transaction'

import { Either } from '@shared/Either'

import { UseCase } from '@useCases/contracts'
import { TransactionNotFoundError } from '@useCases/errors'

export type FindTransactionProps = {
  id: string
}

export type FindTransactionResponse = Either<
  TransactionNotFoundError,
  TransactionProps
>

export type FindTransaction = UseCase<
  FindTransactionProps,
  Promise<FindTransactionResponse>
>
