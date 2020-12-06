import { ITransactionsRepository } from '@repositories/ITransactionsRepository'

import { ICountTransactionsRequestDTO } from './CountTransactionsDTO'

export class CountTransactionsUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private transactionsRepository: ITransactionsRepository) { }

  async execute(props: ICountTransactionsRequestDTO): Promise<number> {
    const { month } = props
    const transactionsCount = month
      ? await this.transactionsRepository.countByMonth(month)
      : await this.transactionsRepository.count()

    return transactionsCount
  }
}
