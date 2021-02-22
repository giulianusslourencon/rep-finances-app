import { Transaction } from '@entities/Transaction'

import {
  IBalanceRepository,
  ITransactionsRepository
} from '@repositories/ports'

import { left, right } from '@shared/Either'

import {
  CreateTransaction,
  CreateTransactionProps,
  CreateTransactionResponse
} from '@useCases/Transactions/ports'

export class CreateTransactionUseCase implements CreateTransaction {
  constructor(
    private readonly transactionsRepository: ITransactionsRepository,
    private readonly balanceRepository: IBalanceRepository
  ) {}

  async execute(
    props: CreateTransactionProps
  ): Promise<CreateTransactionResponse> {
    const transactionOrError = Transaction.create(props)

    if (transactionOrError.isLeft()) return left(transactionOrError.value)

    const transaction = transactionOrError.value

    await this.transactionsRepository.save(transaction.value)
    await this.balanceRepository.setNotUpdatedFromMonth(transaction.month)

    return right(transaction.value)
  }
}
