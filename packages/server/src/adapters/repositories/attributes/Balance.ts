import { IndividualBalanceProps } from '@entities/Finances'

export type MonthBalance = {
  individual_balance: IndividualBalanceProps
}

export type BalanceAttributes = MonthBalance & {
  _id: string
  updated: boolean
}
