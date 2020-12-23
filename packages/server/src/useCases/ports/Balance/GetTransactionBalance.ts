import { BalanceProps } from '@entities/Balance'
import { DomainError } from '@entities/errors'
import { TransactionProps } from '@entities/Transaction'

import { Either } from '@shared/Either'

import { UseCase } from '@useCases/contracts'

export type GetTransactionBalanceProps = {
  transaction: Pick<TransactionProps, 'items' | 'payers'>
}

export type GetTransactionBalanceResponse = Either<
  DomainError & Error,
  BalanceProps
>

export type GetTransactionBalance = UseCase<
  GetTransactionBalanceProps,
  Promise<GetTransactionBalanceResponse>
>
