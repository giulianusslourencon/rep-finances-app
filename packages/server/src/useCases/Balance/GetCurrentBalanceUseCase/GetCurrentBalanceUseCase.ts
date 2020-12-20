import { IBalanceRepository } from '@repositories/IBalanceRepository'

import { BalanceProps } from '@shared/types/Balance'

export class GetCurrentBalanceUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private balanceRepository: IBalanceRepository) { }

  async execute(): Promise<BalanceProps> {
    return await this.balanceRepository.getCurrentBalance()
  }
}
