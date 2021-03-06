import { Transaction } from '@entities/Transaction'

import { left, right } from '@shared/Either'

import {
  CreateTransaction,
  CreateTransactionBalanceRepository,
  CreateTransactionProps,
  CreateTransactionResponse,
  CreateTransactionTransactionsRepository
} from '@useCases/Transactions/ports/CreateTransaction'

export class CreateTransactionUseCase implements CreateTransaction {
  constructor(
    private readonly transactionsRepository: CreateTransactionTransactionsRepository,
    private readonly balanceRepository: CreateTransactionBalanceRepository
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
