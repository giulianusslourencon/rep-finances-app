import { TransactionProps } from '@entities/Finances'

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
    return { ...entity, date: entity.date.toISOString() }
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
