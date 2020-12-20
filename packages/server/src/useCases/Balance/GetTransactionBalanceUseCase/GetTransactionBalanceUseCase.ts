import { Balance } from '@entities/Balance'
import DomainError from '@entities/errors/DomainError'

import { Either, left, right } from '@shared/Either'
import { BalanceProps } from '@shared/types/Balance'

import { IGetTransactionBalanceDTO } from './GetTransactionBalanceDTO'

export class GetTransactionBalanceUseCase {
  execute(
    props: IGetTransactionBalanceDTO
  ): Either<DomainError & Error, BalanceProps> {
    const balanceOrError = Balance.create(props.transaction)
    if (balanceOrError.isLeft()) return left(balanceOrError.value)
    return right(balanceOrError.value.value)
  }
}
