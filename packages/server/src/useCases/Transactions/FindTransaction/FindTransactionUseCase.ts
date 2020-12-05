import { Transaction } from '@entities/Transaction'

import { ITransactionsRepository } from '@repositories/ITransactionsRepository'

import { IFindTransactionRequestDTO } from './FindTransactionDTO'

export class FindTransactionUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private transactionsRepository: ITransactionsRepository) { }

  async execute(
    props: IFindTransactionRequestDTO
  ): Promise<Transaction | null | undefined> {
    const transaction = this.transactionsRepository.findById(props.id)

    return transaction
  }
}
