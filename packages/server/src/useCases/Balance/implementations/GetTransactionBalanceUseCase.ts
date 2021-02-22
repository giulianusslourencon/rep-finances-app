import { BalanceFromTransactionCore } from '@entities/Balance'

import { left, right } from '@shared/Either'

import {
  GetTransactionBalance,
  GetTransactionBalanceProps,
  GetTransactionBalanceResponse
} from '@useCases/Balance/ports'

export class GetTransactionBalanceUseCase implements GetTransactionBalance {
  async execute(
    props: GetTransactionBalanceProps
  ): Promise<GetTransactionBalanceResponse> {
    const balanceOrError = BalanceFromTransactionCore.create(props.transaction)
    if (balanceOrError.isLeft()) return left(balanceOrError.value)
    return right(balanceOrError.value.value)
  }
}
