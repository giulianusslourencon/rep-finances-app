import { TransactionAttributes } from '@repositories/attributes'

export const transactions: TransactionAttributes[] = [
  {
    _id: '20201219',
    amount: 50,
    items: {
      item: {
        related_users: ['G'],
        amount: 50
      }
    },
    month: '202012',
    payers: {
      P: 50
    },
    related: ['P', 'G'],
    date: new Date(1608336000000),
    title: 'Transf P-G'
  },
  {
    _id: '20201223',
    amount: 30,
    items: {
      item: {
        related_users: ['M'],
        amount: 30
      }
    },
    month: '202012',
    payers: {
      F: 30
    },
    related: ['F', 'M'],
    date: new Date(1608723196865),
    title: 'Transf F-M'
  },
  {
    _id: '20201117',
    amount: 60,
    items: {
      item: {
        related_users: ['P'],
        amount: 60
      }
    },
    month: '202011',
    payers: {
      M: 60
    },
    related: ['M', 'P'],
    date: new Date(1605582000000),
    title: 'Transf M-P'
  },
  {
    _id: '20210109',
    amount: 40,
    items: {
      item: {
        related_users: ['F'],
        amount: 40
      }
    },
    month: '202101',
    payers: {
      G: 40
    },
    related: ['G', 'F'],
    date: new Date(1610161200000),
    title: 'Transf G-F'
  }
]
