import { DateParser, Path } from '@shared/utils'

import { IErrorHandler, InvalidError } from '@errors/contracts'
import { CustomReason, FormattingReason } from '@errors/reasons'

import { Name } from '@entities/components'
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
  timestamp: number
  items: TransactionItemsProps
  payers: TransactionPayersProps
}

export class Transaction implements IBalanceable {
  constructor(
    private readonly id: string,
    private readonly title: Name,
    private readonly timestamp: number,
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

    if (isNaN(new Date(props.timestamp).getTime()))
      errorHandler.addError(
        new InvalidError(
          'Date',
          props.timestamp.toString(),
          new FormattingReason()
        ),
        path.add('timestamp').resolve()
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
      transactionTitle,
      props.timestamp,
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

  get value(): TransactionProps {
    return {
      id: this.id,
      title: this.title.value,
      timestamp: this.timestamp,
      items: this.items.value,
      payers: this.payers.value
    }
  }

  get date(): Date {
    return new Date(this.timestamp)
  }

  get amount(): number {
    return this.items.totalPrice
  }

  get month(): string {
    return DateParser.parseDate(this.timestamp)
  }

  get related(): string[] {
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
