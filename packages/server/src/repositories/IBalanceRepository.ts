import { Balance } from '@entities/Balance'

export interface IBalanceRepository {
  setNotUpdatedFromMonth(month: string): Promise<void>
  getCurrentBalance(): Promise<Balance>
}