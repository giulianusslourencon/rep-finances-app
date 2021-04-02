import {
  GetCurrentBalance,
  GetCurrentBalanceBalanceRepository,
  GetCurrentBalanceResponse
} from '@useCases/Finances/ports/GetCurrentBalance'
import { UpdateRegisteredBalance } from '@useCases/Finances/ports/UpdateRegisteredBalance'

export class GetCurrentBalanceUseCase implements GetCurrentBalance {
  constructor(
    private readonly balanceRepository: GetCurrentBalanceBalanceRepository,
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
