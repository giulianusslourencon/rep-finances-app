import {
  BalanceAttributes,
  TransactionAttributes
} from '@repositories/attributes'

import { CreateTransactionProps } from '@useCases/ports/Transactions'

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
      F: 30
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

export const transactionToSave: CreateTransactionProps = {
  items: {
    item: {
      related_users: ['P', 'D'],
      value: 10
    }
  },
  payers: {
    P: 10
  },
  timestamp: 1608865200000,
  title: 'Vinho pra gay night de Natal'
}

export const balances: BalanceAttributes[] = [
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
