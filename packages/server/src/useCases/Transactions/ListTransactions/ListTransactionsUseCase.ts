import {
  ITransactionsRepository,
  TransactionList
} from '@repositories/ITransactionsRepository'

import { IListTransactionsRequestDTO } from './ListTransactionsDTO'

export class ListTransactionsUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private transactionsRepository: ITransactionsRepository) { }

  async execute(props: IListTransactionsRequestDTO): Promise<TransactionList> {
    const { month, skipLimit } = props
    const transactions = month
      ? await this.transactionsRepository.listByMonth(month, skipLimit)
      : await this.transactionsRepository.list(skipLimit)

    return transactions
  }
}
