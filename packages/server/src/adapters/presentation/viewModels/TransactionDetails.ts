import { BalanceProps } from '@entities/Balance'
import { TransactionProps } from '@entities/Transaction'

export type TransactionDetailsViewModel = {
  transaction: TransactionProps
  balance: BalanceProps
}
