import { TransactionViewModel } from '@presentation/viewModels'

import { BalanceProps } from '@entities/Balance'
import { TransactionProps } from '@entities/Transaction'

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
