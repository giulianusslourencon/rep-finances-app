import { TransactionProps } from '@entities/Finances'

import { Either } from '@shared/types'

import { UseCase } from '@useCases/contracts'
import { NotFoundError } from '@useCases/errors'

export type FindTransactionProps = {
  id: string
}

export type FindTransactionResponse = Either<NotFoundError, TransactionProps>

export type FindTransaction = UseCase<
  FindTransactionProps,
  Promise<FindTransactionResponse>
>
