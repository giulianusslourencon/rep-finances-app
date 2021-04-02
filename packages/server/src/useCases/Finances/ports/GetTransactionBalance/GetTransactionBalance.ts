import { InvalidFields } from '@entities/errors'
import { BalanceProps, TransactionProps } from '@entities/Finances'

import { Either } from '@shared/types'

import { UseCase } from '@useCases/contracts'

export type GetTransactionBalanceProps = {
  transaction: Pick<TransactionProps, 'items' | 'payers'>
}

export type GetTransactionBalanceResponse = Either<InvalidFields, BalanceProps>

export type GetTransactionBalance = UseCase<
  GetTransactionBalanceProps,
  Promise<GetTransactionBalanceResponse>
>
