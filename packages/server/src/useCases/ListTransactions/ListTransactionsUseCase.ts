import { ITransactionsRepository } from '@repositories/ITransactionsRepository'
import { IListTransactionsRequestDTO } from './ListTransactionsDTO'

export class ListTransactionsUseCase {
  constructor(
    private transactionsRepository: ITransactionsRepository
  ) { }

  async execute(skipLimit?: IListTransactionsRequestDTO) {
    const transactions = await this.transactionsRepository.list(skipLimit)

    return transactions
  }
}