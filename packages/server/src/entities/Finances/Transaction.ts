import { DateParser } from '@shared/utils'

import { Amount, Name } from '@entities/components'
import { EntityErrorHandler, InvalidError } from '@entities/errors'
import { CustomReason, FormattingReason } from '@entities/errors/reasons'
import {
  RelatedList,
  TransactionItems,
  TransactionItemsProps,
  TransactionPayers,
  TransactionPayersProps
} from '@entities/Finances'

export type TransactionInitProps = {
  id: string
  title: string
  timestamp: number
  items: TransactionItemsProps
  payers: TransactionPayersProps
}

export type TransactionProps = {
  _id: string
  title: string
  date: Date
  month: string
  items: TransactionItemsProps
  payers: TransactionPayersProps
  amount: number
  related: string[]
}

export class Transaction {
  public readonly _id!: string

  public title!: Name
  public date!: Date
  public items!: TransactionItems
  public payers!: TransactionPayers

  public readonly month!: string
  public readonly amount!: Amount
  public readonly related!: RelatedList

  private constructor(
    id: string,
    title: Name,
    date: Date,
    items: TransactionItems,
    payers: TransactionPayers,
    month: string,
    amount: Amount,
    related: RelatedList
  ) {
    this._id = id
    this.title = title
    this.date = date
    this.items = items
    this.payers = payers
    this.month = month
    this.amount = amount
    this.related = related

    Object.freeze(this)
  }

  static create(
    props: TransactionInitProps,
    errorHandler: EntityErrorHandler,
    path = ''
  ): Transaction {
    const transactionTitle = Name.create(
      props.title,
      errorHandler,
      `${path}.title`
    )
    const transactionItems = TransactionItems.create(
      props.items,
      errorHandler,
      `${path}.items`
    )
    const transactionPayers = TransactionPayers.create(
      props.payers,
      errorHandler,
      `${path}.payers`
    )

    const date = new Date(props.timestamp)
    if (isNaN(date.getTime()))
      errorHandler.addError(
        new InvalidError(
          'Date',
          props.timestamp.toString(),
          new FormattingReason()
        ),
        `${path}.timestamp`
      )

    const month = DateParser.parseDate(props.timestamp)

    const itemsAmount = Object.entries(props.items).reduce((acc, cur) => {
      return acc + cur[1].amount
    }, 0)

    const totalPaid = Object.entries(props.payers).reduce((acc, cur) => {
      return acc + cur[1]
    }, 0)

    if (itemsAmount.toFixed(2) !== totalPaid.toFixed(2))
      errorHandler.addError(
        new InvalidError(
          'Payment',
          '',
          new CustomReason('Items values are distinct from total paid.')
        ),
        path
      )

    const transactionAmount = Amount.create(itemsAmount, errorHandler, path)

    let related = Object.keys(props.payers).map(id => id.trim().toUpperCase())
    for (const item of Object.values(props.items)) {
      related = related.concat(
        item.related_users.map(id => id.trim().toUpperCase())
      )
    }
    related = [...new Set(related)]

    const relatedUsers = RelatedList.create(
      related,
      new EntityErrorHandler(), // Ingoring duplicate errors
      path
    )

    return new Transaction(
      props.id,
      transactionTitle,
      date,
      transactionItems,
      transactionPayers,
      month,
      transactionAmount,
      relatedUsers
    )
  }

  get value(): TransactionProps {
    return {
      _id: this._id,
      title: this.title.value,
      date: this.date,
      items: this.items.value,
      payers: this.payers.value,
      month: this.month,
      amount: this.amount.value,
      related: this.related.value
    }
  }
}
