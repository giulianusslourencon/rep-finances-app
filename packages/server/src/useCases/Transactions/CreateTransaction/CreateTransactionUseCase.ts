import { Transaction } from '@entities/Transaction'

import { IBalanceRepository } from '@repositories/IBalanceRepository'
import { ITransactionsRepository } from '@repositories/ITransactionsRepository'

import { ICreateTransactionRequestDTO } from './CreateTransactionDTO'

export class CreateTransactionUseCase {
  /* eslint-disable prettier/prettier */
  constructor(
    private transactionsRepository: ITransactionsRepository,
    private balanceRepository: IBalanceRepository
  ) { }
  /* eslint-enable prettier/prettier */

  async execute(data: ICreateTransactionRequestDTO): Promise<Transaction> {
    const transaction = new Transaction(data)

    await this.transactionsRepository.save(transaction)
    await this.balanceRepository.setNotUpdatedFromMonth(transaction.month)

    return transaction
  }
}
