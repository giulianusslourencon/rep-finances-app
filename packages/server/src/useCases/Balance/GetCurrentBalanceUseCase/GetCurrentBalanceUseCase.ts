import { IBalanceRepository } from '@repositories/IBalanceRepository'

export class GetCurrentBalanceUseCase {
  constructor(
    private balanceRepository: IBalanceRepository
  ) {}

  async execute() {
    return await this.balanceRepository.getCurrentBalance()
  }
}