import { left, right } from '@shared/types'

import { BalanceEntityManager } from '@entities/managers/Finances'

import {
  GetTransactionBalance,
  GetTransactionBalanceProps,
  GetTransactionBalanceResponse
} from '@useCases/Finances/ports/GetTransactionBalance'

export class GetTransactionBalanceUseCase implements GetTransactionBalance {
  async execute(
    props: GetTransactionBalanceProps
  ): Promise<GetTransactionBalanceResponse> {
    const balanceOrError = BalanceEntityManager.createFromTransactionCore(
      props.transaction
    )
    if (balanceOrError.isLeft()) return left(balanceOrError.value)
    return right(balanceOrError.value.value)
  }
}
