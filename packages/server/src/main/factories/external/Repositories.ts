import {
  MongoBalanceRepository,
  MongoTransactionsRepository
} from '@repositories/mongodb/implementations'

export const MongoTransactions = new MongoTransactionsRepository()
export const MongoBalance = new MongoBalanceRepository()
