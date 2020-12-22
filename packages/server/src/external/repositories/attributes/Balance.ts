export type BalanceAttributes = {
  _id: string
  individual_balance: {
    [user: string]: number
  }
  updated: boolean
}
