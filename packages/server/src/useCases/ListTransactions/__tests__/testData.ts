import { Transaction } from "@server/entities/Transaction";

export const transactions = [
  {
    title: 'Compra 1',
    month: '202011',
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
    month: '202011',
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
      P: 70
    }
  },
  {
    title: 'Compra 3',
    month: '202011',
    items: {
      item1: {
        value: 10,
        related_users: ['P', 'G', 'M', 'F']
      }
    },
    payers: {
      P: 10
    }
  },
  {
    title: 'Compra 4',
    month: '202011',
    items: {
      item1: {
        value: 200,
        related_users: ['G']
      }
    },
    payers: {
      P: 200
    }
  }
] as Omit<Transaction, '_id' | 'amount'>[]