import { ITransactionsRepository } from '@repositories/ports'

import {
  ListTransactions,
  ListTransactionsProps,
  ListTransactionsResponse
} from '@useCases/ports/Transactions'

export class ListTransactionsUseCase implements ListTransactions {
  constructor(
    private readonly transactionsRepository: ITransactionsRepository
  ) {}

  async execute(
    props: ListTransactionsProps
  ): Promise<ListTransactionsResponse> {
    const { month, skipLimit } = props
    const transactions = month
      ? await this.transactionsRepository.listByMonth(month, skipLimit)
      : await this.transactionsRepository.list(skipLimit)

    return transactions
  }
}
