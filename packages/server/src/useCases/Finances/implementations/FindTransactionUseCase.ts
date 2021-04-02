import { left, right } from '@shared/types'

import { NotFoundError } from '@useCases/errors'
import {
  FindTransaction,
  FindTransactionProps,
  FindTransactionResponse,
  FindTransactionTransactionsRepository
} from '@useCases/Finances/ports/FindTransaction'

export class FindTransactionUseCase implements FindTransaction {
  constructor(
    private readonly transactionsRepository: FindTransactionTransactionsRepository
  ) {}

  async execute(props: FindTransactionProps): Promise<FindTransactionResponse> {
    const transaction = await this.transactionsRepository.findById(props.id)

    if (transaction) return right(transaction)
    return left(new NotFoundError('Transaction', 'id', props.id))
  }
}
