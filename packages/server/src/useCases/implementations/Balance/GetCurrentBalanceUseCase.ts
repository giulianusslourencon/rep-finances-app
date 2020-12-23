import { IBalanceRepository } from '@repositories/ports'

import {
  GetCurrentBalance,
  GetCurrentBalanceResponse,
  UpdateRegisteredBalance
} from '@useCases/ports/Balance'

export class GetCurrentBalanceUseCase implements GetCurrentBalance {
  constructor(
    private readonly balanceRepository: IBalanceRepository,
    private readonly updateRegisteredBalance: UpdateRegisteredBalance
  ) {}

  async execute(): Promise<GetCurrentBalanceResponse> {
    await this.updateRegisteredBalance.execute(undefined)

    const lastRegisteredBalance =
      (await this.balanceRepository.getLastRegisteredMonth()) || '0'

    return (
      (await this.balanceRepository.getMonthBalance(lastRegisteredBalance)) || {
        individual_balance: {}
      }
    )
  }
}
