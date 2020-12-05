import { Balance } from '@entities/Balance'

import { IBalanceRepository } from '@repositories/IBalanceRepository'

export class GetCurrentBalanceUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private balanceRepository: IBalanceRepository) { }

  async execute(): Promise<Balance> {
    return await this.balanceRepository.getCurrentBalance()
  }
}
