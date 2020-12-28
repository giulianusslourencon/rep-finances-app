import { TransactionProps } from '@entities/Transaction'

export class TransactionViewModel {
  _id!: string
  title!: string
  date!: string
  month!: string
  items!: TransactionItemsProps
  payers!: TransactionPayersProps
  amount!: number
  related!: string[]

  static map(entity: TransactionProps): TransactionViewModel {
    return {
      _id: entity._id,
      title: entity.title,
      date: entity.date.toISOString(),
      amount: entity.amount,
      related: entity.related,
      month: entity.month,
      items: entity.items,
      payers: entity.payers
    }
  }
}

type TransactionItemsProps = {
  [itemName: string]: {
    amount: number
    related_users: string[]
  }
}

type TransactionPayersProps = {
  [userId: string]: number
}
