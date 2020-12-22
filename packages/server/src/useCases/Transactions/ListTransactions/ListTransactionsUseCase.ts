import { ITransactionsRepository } from '@repositories/ports/ITransactionsRepository'

import { TransactionResumeProps } from '@shared/@types/Transaction'

import { IListTransactionsRequestDTO } from './ListTransactionsDTO'

export class ListTransactionsUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private transactionsRepository: ITransactionsRepository) { }

  async execute(
    props: IListTransactionsRequestDTO
  ): Promise<TransactionResumeProps[]> {
    const { month, skipLimit } = props
    const transactions = month
      ? await this.transactionsRepository.listByMonth(month, skipLimit)
      : await this.transactionsRepository.list(skipLimit)

    return transactions
  }
}
