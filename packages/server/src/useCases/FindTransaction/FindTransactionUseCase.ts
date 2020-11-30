import { ITransactionsRepository } from '@repositories/ITransactionsRepository'
import { IFindTransactionRequestDTO } from './FindTransactionDTO'

export class FindTransactionUseCase {
  constructor(
    private transactionsRepository: ITransactionsRepository
  ) { }

  async execute(props: IFindTransactionRequestDTO) {
    const transaction = this.transactionsRepository.findById(props.id)

    return transaction
  }
}