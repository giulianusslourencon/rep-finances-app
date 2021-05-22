import { IndividualBalanceProps } from '@entities/Finances'

export type MonthBalance = {
  individual_balance: IndividualBalanceProps
}

export type BalanceSchema = MonthBalance & {
  _id: string
  updated: boolean
}
