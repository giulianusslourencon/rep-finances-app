import { BalanceSchema } from '@repositories/schemas'

export const balance: BalanceSchema[] = [
  {
    _id: '202011',
    individual_balance: {
      M: 60,
      P: -60
    },
    updated: true
  },
  {
    _id: '202012',
    individual_balance: {
      P: -10,
      M: 60,
      G: -50
    },
    updated: false
  }
]

export const updatedBalance: BalanceSchema[] = [
  {
    _id: '202011',
    individual_balance: {
      M: 60,
      P: -60
    },
    updated: true
  },
  {
    _id: '202012',
    individual_balance: {
      P: -10,
      M: 30,
      G: -50,
      F: 30
    },
    updated: true
  },
  {
    _id: '202101',
    individual_balance: {
      P: -10,
      M: 30,
      G: -10,
      F: -10
    },
    updated: true
  }
]
