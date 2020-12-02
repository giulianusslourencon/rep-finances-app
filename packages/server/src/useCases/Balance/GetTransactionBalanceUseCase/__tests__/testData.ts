import { Transaction } from '@entities/Transaction'

export const transactions = [
  {
    title: 'Compra 1',
    timestamp: 1606827266326,
    items: {
      item1: {
        value: 20,
        related_users: ['P', 'G']
      },
      item2: {
        value: 30,
        related_users: ['P']
      }
    },
    payers: {
      P: 50
    }
  },
  {
    title: 'Compra 2',
    timestamp: 1606829066326,
    items: {
      item1: {
        value: 40,
        related_users: ['P', 'G']
      },
      item2: {
        value: 30,
        related_users: ['P']
      }
    },
    payers: {
      P: 50,
      G: 20
    }
  }
] as Omit<Transaction, '_id' | 'month' | 'amount'>[]