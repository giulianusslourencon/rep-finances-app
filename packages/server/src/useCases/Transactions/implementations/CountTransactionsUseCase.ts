import {
  CountTransactions,
  CountTransactionsProps,
  CountTransactionsResponse,
  CountTransactionsTransactionsRepository
} from '@useCases/Transactions/ports/CountTransactions'

export class CountTransactionsUseCase implements CountTransactions {
  constructor(
    private readonly transactionsRepository: CountTransactionsTransactionsRepository
  ) {}

  async execute(
    props: CountTransactionsProps
  ): Promise<CountTransactionsResponse> {
    const { month } = props
    const transactionsCount = month
      ? await this.transactionsRepository.countByMonth(month)
      : await this.transactionsRepository.count()

    return transactionsCount
  }
}
