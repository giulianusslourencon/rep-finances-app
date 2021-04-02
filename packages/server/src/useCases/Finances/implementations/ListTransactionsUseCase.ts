import {
  ListTransactions,
  ListTransactionsProps,
  ListTransactionsResponse,
  ListTransactionsTransactionsRepository
} from '@useCases/Finances/ports/ListTransactions'

export class ListTransactionsUseCase implements ListTransactions {
  constructor(
    private readonly transactionsRepository: ListTransactionsTransactionsRepository
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
