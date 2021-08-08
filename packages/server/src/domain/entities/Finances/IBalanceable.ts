import { IndividualBalanceProps } from '@entities/Finances'

export interface IBalanceable {
  extractBalance: () => IndividualBalanceProps
}
