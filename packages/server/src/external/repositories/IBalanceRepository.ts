import { BalanceProps } from '@shared/types/Balance'

export interface IBalanceRepository {
  setNotUpdatedFromMonth(month: string): Promise<void>
  getCurrentBalance(): Promise<BalanceProps>
}
