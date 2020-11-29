import { Transaction } from "@entities/Transaction"
import { ITransactionsRepository } from "@repositories/ITransactionsRepository"

export class LocalTransactionsRepository implements ITransactionsRepository {
  private transactions: Transaction[] = []
  
  async findById(id: string): Promise<Transaction> {
    const transaction = this.transactions.find(transaction => transaction._id === id)

    return transaction
  }

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction)
  }  
}