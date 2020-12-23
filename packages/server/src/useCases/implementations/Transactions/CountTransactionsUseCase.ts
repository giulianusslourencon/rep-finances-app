import { ITransactionsRepository } from '@repositories/ports'

import {
  CountTransactions,
  CountTransactionsProps,
  CountTransactionsResponse
} from '@useCases/ports/Transactions'

export class CountTransactionsUseCase implements CountTransactions {
  constructor(
    private readonly transactionsRepository: ITransactionsRepository
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
