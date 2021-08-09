import { DateParser, Path } from '@shared/utils'

import { IErrorHandler, InvalidError } from '@errors/contracts'

import { Name } from '@entities/components'
import { CustomReason, FormattingReason } from '@entities/errors/reasons'
import {
  IBalanceable,
  IndividualBalanceProps,
  TransactionItems,
  TransactionItemsProps,
  TransactionPayers,
  TransactionPayersProps
} from '@entities/Finances'

export type TransactionProps = {
  id: string
  title: string
  date: number | string | Date
  items: TransactionItemsProps
  payers: TransactionPayersProps
}

export type TransactionFullInfo = {
  id: string
  title: string
  date: Date
  items: TransactionItemsProps
  payers: TransactionPayersProps
  month: string
  related: string[]
  amount: number
}

export class Transaction implements IBalanceable {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly date: number | string | Date,
    private readonly items: TransactionItems,
    private readonly payers: TransactionPayers
  ) {}

  static create(
    props: TransactionProps,
    errorHandler: IErrorHandler,
    path = new Path()
  ): Transaction {
    const transactionTitle = Name.create(
      props.title,
      errorHandler,
      path.add('title')
    )
    const transactionItems = TransactionItems.create(
      props.items,
      errorHandler,
      path.add('items')
    )
    const transactionPayers = TransactionPayers.create(
      props.payers,
      errorHandler,
      path.add('payers')
    )

    if (isNaN(new Date(props.date).getTime()))
      errorHandler.addError(
        new InvalidError('Date', props.date.toString(), new FormattingReason()),
        path.add('date').resolve()
      )

    const totalPrice = transactionItems.totalPrice

    const totalPaid = transactionPayers.totalPaid

    if (totalPrice.toFixed(2) !== totalPaid.toFixed(2)) {
      errorHandler.addError(
        new InvalidError(
          'Payment',
          '',
          new CustomReason('Items values are distinct from total paid.')
        ),
        path.resolve()
      )
    }

    return new Transaction(
      props.id,
      transactionTitle.value,
      props.date,
      transactionItems,
      transactionPayers
    )
  }

  extractBalance(): IndividualBalanceProps {
    const usersBalance: IndividualBalanceProps = { ...this.payers.value }

    Object.values(this.items.value).forEach(item => {
      const nUsers = item.related_users.length

      item.related_users.forEach(user => {
        usersBalance[user] = (usersBalance[user] || 0) - item.amount / nUsers
      })
    })
    return usersBalance
  }

  get value(): TransactionFullInfo {
    return {
      id: this.id,
      title: this.title,
      date: new Date(this.date),
      items: this.items.value,
      payers: this.payers.value,
      amount: this.amount,
      month: this.month,
      related: this.related
    }
  }

  private get amount(): number {
    return this.items.totalPrice
  }

  private get month(): string {
    return DateParser.parseDate(new Date(this.date))
  }

  private get related(): string[] {
    let related = Object.keys(this.payers.value).map(id =>
      id.trim().toUpperCase()
    )
    for (const item of Object.values(this.items.value)) {
      related = related.concat(
        item.related_users.map(id => id.trim().toUpperCase())
      )
    }
    return [...new Set(related)]
  }
}
