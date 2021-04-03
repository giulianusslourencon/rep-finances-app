import { left, right } from '@shared/types'

import { Transaction } from '@entities/Finances'

import {
  CreateTransaction,
  CreateTransactionBalanceRepository,
  CreateTransactionIdGenerator,
  CreateTransactionProps,
  CreateTransactionResponse,
  CreateTransactionTransactionsRepository
} from '@useCases/Finances/ports/CreateTransaction'

export class CreateTransactionUseCase implements CreateTransaction {
  constructor(
    private readonly transactionsRepository: CreateTransactionTransactionsRepository,
    private readonly balanceRepository: CreateTransactionBalanceRepository,
    private readonly idGenerator: CreateTransactionIdGenerator
  ) {}

  async execute(
    props: CreateTransactionProps
  ): Promise<CreateTransactionResponse> {
    const id = await this.idGenerator.generateUniqueId()
    const transactionOrError = Transaction.create(props, id)

    if (transactionOrError.isLeft()) return left(transactionOrError.value)

    const transaction = transactionOrError.value

    await this.transactionsRepository.save(transaction.value)
    await this.balanceRepository.setNotUpdatedFromMonth(transaction.month)

    return right(transaction.value)
  }
}
