import { ITransactionsRepository } from '@repositories/ITransactionsRepository'
import { IListTransactionsRequestDTO } from './ListTransactionsDTO'

export class ListTransactionsUseCase {
  constructor(
    private transactionsRepository: ITransactionsRepository
  ) { }

  async execute(props: IListTransactionsRequestDTO) {
    const transactions = props.month 
      ? await this.transactionsRepository.listByMonth(props.month, props.skipLimit)
      : await this.transactionsRepository.list(props.skipLimit)

    return transactions
  }
}