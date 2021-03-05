import { ListTransactionsResponse } from '@useCases/Transactions/ports/ListTransactions'

export type TransactionsArrayViewModel = TransactionResume[]
export class TransactionResume {
  _id!: string
  title!: string
  date!: string
  amount!: number
  related!: string[]

  static mapCollection(
    entities: ListTransactionsResponse
  ): TransactionsArrayViewModel {
    return entities.map(entity => {
      return {
        _id: entity._id,
        title: entity.title,
        date: entity.date.toISOString(),
        amount: entity.amount,
        related: entity.related
      }
    })
  }
}
