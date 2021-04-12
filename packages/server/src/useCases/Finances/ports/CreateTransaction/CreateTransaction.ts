import { Either } from '@shared/types'

import { InvalidFields } from '@entities/errors'
import { TransactionInitProps, TransactionProps } from '@entities/Finances'

import { UseCase } from '@useCases/contracts'

export type CreateTransactionProps = Omit<TransactionInitProps, 'id'>

export type CreateTransactionResponse = Either<InvalidFields, TransactionProps>

export type CreateTransaction = UseCase<
  CreateTransactionProps,
  Promise<CreateTransactionResponse>
>
