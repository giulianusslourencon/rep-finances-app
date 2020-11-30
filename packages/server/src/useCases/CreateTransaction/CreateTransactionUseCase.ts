import { Transaction } from '@entities/Transaction'
import { ITransactionsRepository } from '@repositories/ITransactionsRepository'
import { ICreateTransactionRequestDTO } from './CreateTransactionDTO'

export class CreateTransactionUseCase {
  constructor(
    private transactionsRepository: ITransactionsRepository
  ) {}
  
  async execute(data: ICreateTransactionRequestDTO) {
    const transaction = new Transaction(data)

    await this.transactionsRepository.save(transaction)

    return transaction
  }
}