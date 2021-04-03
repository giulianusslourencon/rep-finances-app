import { BalanceProps } from '@entities/Finances'

export class CurrentBalanceViewModel {
  balance!: {
    [userId: string]: number
  }

  static map(entity: BalanceProps): CurrentBalanceViewModel {
    return {
      balance: entity.individual_balance
    }
  }
}
