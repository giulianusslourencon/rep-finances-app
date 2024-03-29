import { Balance } from '@entities/Finances'
import { BalanceEntityManager } from '@entities/managers/Finances'

import {
  UpdateRegisteredBalance,
  UpdateRegisteredBalanceBalanceRepository,
  UpdateRegisteredBalanceTransactionsRepository
} from '@useCases/Finances/ports/UpdateRegisteredBalance'

export class UpdateRegisteredBalanceUseCase implements UpdateRegisteredBalance {
  constructor(
    private readonly transactionsRepository: UpdateRegisteredBalanceTransactionsRepository,
    private readonly balanceRepository: UpdateRegisteredBalanceBalanceRepository
  ) {}

  async execute(): Promise<void> {
    const lastRegisteredMonth =
      (await this.balanceRepository.getLastRegisteredMonth()) || '0'

    const notUpdatedRegisteredMonths = await this.balanceRepository.getNotUpdatedMonths()
    const notRegisteredMonths = await this.transactionsRepository.getNotRegisteredMonths(
      lastRegisteredMonth
    )

    const notUpdatedMonths = [
      ...notUpdatedRegisteredMonths,
      ...notRegisteredMonths
    ].sort()

    if (notUpdatedMonths.length === 0) return

    const lastUpdatedMonth =
      (await this.balanceRepository.getLastUpdatedMonth()) || '0'

    let lastMonthBalance = (await this.balanceRepository.getMonthBalance(
      lastUpdatedMonth
    )) || { individual_balance: {} }

    for (const month of notUpdatedMonths) {
      const monthTransactions = await this.transactionsRepository.listItemsAndPayersByMonth(
        month
      )

      const updatedMonthBalance = (<Balance>(
        BalanceEntityManager.createFromArray([
          lastMonthBalance,
          ...monthTransactions
        ]).value
      )).value

      await this.balanceRepository.updateMonth(month, updatedMonthBalance)

      lastMonthBalance = updatedMonthBalance
    }
  }
}
