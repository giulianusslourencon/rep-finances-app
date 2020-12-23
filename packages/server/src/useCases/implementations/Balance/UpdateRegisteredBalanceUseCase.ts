import { Balance, BalanceFromArray } from '@entities/Balance'

import {
  ITransactionsRepository,
  IBalanceRepository
} from '@repositories/ports'

import { UpdateRegisteredBalance } from '@useCases/ports/Balance'

export class UpdateRegisteredBalanceUseCase implements UpdateRegisteredBalance {
  constructor(
    private readonly transactionsRepository: ITransactionsRepository,
    private readonly balanceRepository: IBalanceRepository
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
        BalanceFromArray.create([lastMonthBalance, ...monthTransactions]).value
      )).value

      await this.balanceRepository.updateMonth(month, updatedMonthBalance)

      lastMonthBalance = updatedMonthBalance
    }
  }
}
