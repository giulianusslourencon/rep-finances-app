import { BalanceProps } from '@entities/Finances'

export interface UpdateRegisteredBalanceBalanceRepository {
  getMonthBalance(month: string): Promise<BalanceProps | null | undefined>
  getNotUpdatedMonths(): Promise<string[]>
  getLastRegisteredMonth(): Promise<string | null | undefined>
  getLastUpdatedMonth(): Promise<string | null | undefined>
  updateMonth(month: string, balance: BalanceProps): Promise<void>
}
