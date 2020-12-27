import { TransactionProps } from '@entities/Transaction'

export class TransactionViewModel {
  _id!: string
  title!: string
  timestamp!: number
  month!: string
  items!: TransactionItemsProps
  payers!: TransactionPayersProps
  amount!: number
  related!: string[]

  static map(entity: TransactionProps): TransactionViewModel {
    return {
      _id: entity._id,
      title: entity.title,
      timestamp: entity.date.getTime(),
      amount: entity.amount,
      related: entity.related,
      month: entity.month,
      items: entity.items,
      payers: entity.payers
    }
  }
}

type TransactionItemsProps = {
  [title: string]: {
    amount: number
    related_users: string[]
  }
}

type TransactionPayersProps = {
  [user: string]: number
}
