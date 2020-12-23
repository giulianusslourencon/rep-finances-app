import { TransactionAttributes } from '@repositories/attributes'

export const transactions: TransactionAttributes[] = [
  {
    _id: '20201219',
    amount: 50,
    items: {
      item: {
        related_users: ['G'],
        value: 50
      }
    },
    month: '202012',
    payers: {
      P: 50
    },
    related: ['P', 'G'],
    timestamp: 1608336000000,
    title: 'Transf P-G'
  },
  {
    _id: '20201223',
    amount: 30,
    items: {
      item: {
        related_users: ['M'],
        value: 30
      }
    },
    month: '202012',
    payers: {
      F: 50
    },
    related: ['F', 'M'],
    timestamp: 1608723196865,
    title: 'Transf F-M'
  },
  {
    _id: '20201117',
    amount: 60,
    items: {
      item: {
        related_users: ['P'],
        value: 60
      }
    },
    month: '202011',
    payers: {
      M: 60
    },
    related: ['M', 'P'],
    timestamp: 1605582000000,
    title: 'Transf M-P'
  },
  {
    _id: '20210109',
    amount: 40,
    items: {
      item: {
        related_users: ['F'],
        value: 40
      }
    },
    month: '202101',
    payers: {
      G: 40
    },
    related: ['G', 'F'],
    timestamp: 1610161200000,
    title: 'Transf G-F'
  }
]

export const transactionToSave: TransactionAttributes = {
  _id: '20201225',
  amount: 10,
  items: {
    item: {
      related_users: ['P', 'D'],
      value: 10
    }
  },
  month: '202012',
  payers: {
    P: 10
  },
  related: ['P', 'D'],
  timestamp: 1608865200000,
  title: 'Vinho pra gay night de Natal'
}
