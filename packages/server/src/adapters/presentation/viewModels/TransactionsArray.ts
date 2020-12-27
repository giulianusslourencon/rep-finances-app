import { ListTransactionsResponse } from '@useCases/ports/Transactions'

export type TransactionsArrayViewModel = TransactionResume[]
export class TransactionResume {
  _id!: string
  title!: string
  timestamp!: number
  amount!: number
  related!: string[]

  static mapCollection(
    entities: ListTransactionsResponse
  ): TransactionsArrayViewModel {
    return entities.map(entity => {
      return {
        _id: entity._id,
        title: entity.title,
        timestamp: entity.date.getTime(),
        amount: entity.amount,
        related: entity.related
      }
    })
  }
}
