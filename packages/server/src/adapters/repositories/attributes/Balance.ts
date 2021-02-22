import { IndividualBalanceProps } from '@entities/Balance'

export type MonthBalance = {
  individual_balance: IndividualBalanceProps
}

export type BalanceAttributes = MonthBalance & {
  _id: string
  updated: boolean
}
