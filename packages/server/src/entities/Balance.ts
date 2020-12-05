import { TransactionCore } from '@repositories/ITransactionsRepository'

import { Transaction } from './Transaction'

export class Balance {
  public individual_balance!: {
    [user_id: string]: number
  }

  constructor(transaction: TransactionCore | (TransactionCore | Balance)[]) {
    if (!(transaction instanceof Array)) {
      this.individual_balance = { ...transaction.payers }

      Object.values(transaction.items).forEach(item => {
        const nUsers = item.related_users.length

        item.related_users.forEach(user => {
          this.individual_balance[user] = this.individual_balance[user] || 0
          this.individual_balance[user] -= item.value / nUsers
        })
      })
    } else {
      const balances = transaction.map(transac => {
        if ((<Balance>transac).individual_balance)
          return (<Balance>transac).individual_balance
        return new Balance(<Transaction>transac).individual_balance
      })

      this.individual_balance = balances.reduce((acc, cur) => {
        for (const [user, user_balance] of Object.entries(cur)) {
          acc[user] = acc[user] || 0
          acc[user] += user_balance
        }
        return acc
      }, {})
    }

    Object.keys(this.individual_balance).forEach(user => {
      if (!this.individual_balance[user]) delete this.individual_balance[user]
    })
  }
}
