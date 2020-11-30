import { ITransactionsRepository } from '@repositories/ITransactionsRepository'
import { IListTransactionsRequestDTO } from './ListTransactionsDTO'

export class ListTransactionsUseCase {
  constructor(
    private transactionsRepository: ITransactionsRepository
  ) { }

  async execute(skipLimit?: IListTransactionsRequestDTO, month?: string) {
    const transactions = month 
      ? await this.transactionsRepository.listByMonth(month, skipLimit)
      : await this.transactionsRepository.list(skipLimit)

    return transactions
  }
}