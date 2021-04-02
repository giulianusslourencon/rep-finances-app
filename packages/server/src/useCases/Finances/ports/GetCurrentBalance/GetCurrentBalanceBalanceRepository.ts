import { BalanceProps } from '@entities/Finances'

export interface GetCurrentBalanceBalanceRepository {
  getMonthBalance(month: string): Promise<BalanceProps | null | undefined>
  getLastRegisteredMonth(): Promise<string | null | undefined>
}
