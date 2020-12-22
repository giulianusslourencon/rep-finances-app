import { ITransactionsRepository } from '@repositories/ports/ITransactionsRepository'

import { TransactionProps } from '@shared/@types/Transaction'

import { IFindTransactionRequestDTO } from './FindTransactionDTO'

export class FindTransactionUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private transactionsRepository: ITransactionsRepository) { }

  async execute(
    props: IFindTransactionRequestDTO
  ): Promise<TransactionProps | null | undefined> {
    const transaction = this.transactionsRepository.findById(props.id)

    return transaction
  }
}
