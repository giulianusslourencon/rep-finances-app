import { BalanceProps } from '@entities/Balance'

export interface GetCurrentBalanceBalanceRepository {
  getMonthBalance(month: string): Promise<BalanceProps | null | undefined>
  getLastRegisteredMonth(): Promise<string | null | undefined>
}
