import { Transaction } from './Transaction'

export class Balance {
  
  public individual_balance!: {
    [user_id: string]: number
  }
  
  constructor(transaction: Transaction) {
    this.individual_balance = transaction.payers

    Object.values(transaction.items).forEach(item => {
      const nUsers = item.related_users.length

      item.related_users.forEach(user => {
        this.individual_balance[user] = this.individual_balance[user] || 0
        this.individual_balance[user] -= item.value / nUsers
      })
    })
  }
}