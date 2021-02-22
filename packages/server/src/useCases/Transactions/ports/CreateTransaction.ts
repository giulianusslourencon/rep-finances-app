import { DomainError } from '@entities/errors'
import { TransactionInitProps, TransactionProps } from '@entities/Transaction'

import { Either } from '@shared/Either'

import { UseCase } from '@useCases/contracts'

export type CreateTransactionProps = TransactionInitProps

export type CreateTransactionResponse = Either<
  Error & DomainError,
  TransactionProps
>

export type CreateTransaction = UseCase<
  CreateTransactionProps,
  Promise<CreateTransactionResponse>
>
