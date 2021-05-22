import { TransactionViewModel } from '@presentation/viewModels/Finances'

import { BalanceProps, TransactionProps } from '@entities/Finances'

export class TransactionDetailsViewModel {
  transaction!: TransactionViewModel
  balance!: {
    [userId: string]: number
  }

  static map(
    transaction: TransactionProps,
    balance: BalanceProps
  ): TransactionDetailsViewModel {
    return {
      balance: balance.individual_balance,
      transaction: TransactionViewModel.map(transaction)
    }
  }
}
