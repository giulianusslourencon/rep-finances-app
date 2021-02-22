import { ITransactionsRepository } from '@repositories/ports'

import { left, right } from '@shared/Either'

import { TransactionNotFoundError } from '@useCases/errors'
import {
  FindTransaction,
  FindTransactionProps,
  FindTransactionResponse
} from '@useCases/Transactions/ports'

export class FindTransactionUseCase implements FindTransaction {
  constructor(
    private readonly transactionsRepository: ITransactionsRepository
  ) {}

  async execute(props: FindTransactionProps): Promise<FindTransactionResponse> {
    const transaction = await this.transactionsRepository.findById(props.id)

    if (transaction) return right(transaction)
    return left(new TransactionNotFoundError(props.id))
  }
}
