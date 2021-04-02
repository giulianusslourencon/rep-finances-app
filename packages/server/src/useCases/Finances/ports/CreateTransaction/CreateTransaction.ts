import { InvalidFields } from '@entities/errors'
import { TransactionInitProps, TransactionProps } from '@entities/Finances'

import { Either } from '@shared/types'

import { UseCase } from '@useCases/contracts'

export type CreateTransactionProps = TransactionInitProps

export type CreateTransactionResponse = Either<InvalidFields, TransactionProps>

export type CreateTransaction = UseCase<
  CreateTransactionProps,
  Promise<CreateTransactionResponse>
>
