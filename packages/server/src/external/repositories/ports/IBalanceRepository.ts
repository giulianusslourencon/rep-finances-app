import { BalanceAttributes } from '@repositories/attributes'
import { IRepository } from '@repositories/ports'

export type MonthBalance = Pick<BalanceAttributes, 'individual_balance'>

export interface IBalanceRepository extends IRepository {
  setNotUpdatedFromMonth(month: string): Promise<void>
  getMonthBalance(month: string): Promise<MonthBalance | null | undefined>
  getNotUpdatedMonths(): Promise<string[]>
  updateMonth(month: string, balance: MonthBalance): Promise<void>
}
