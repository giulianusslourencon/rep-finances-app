import { v4 as uuid } from 'uuid'

import { Amount, Name } from '@entities/components'
import { FieldKeys, InvalidError, InvalidFields } from '@entities/errors'
import { CustomReason, FormattingReason } from '@entities/errors/reasons'
import {
  RelatedList,
  TransactionItems,
  TransactionItemsProps,
  TransactionPayers,
  TransactionPayersProps
} from '@entities/Finances'

import { Either, left, right } from '@shared/types'
import { DateParser } from '@shared/utils'

export type TransactionInitProps = {
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
    title: Name,
    date: Date,
    items: TransactionItems,
    payers: TransactionPayers,
    month: string,
    amount: Amount,
    related: RelatedList,
    id?: string
  ) {
    this.title = title
    this.date = date
    this.items = items
    this.payers = payers
    this.month = month
    this.amount = amount
    this.related = related
    this._id = id || uuid()

    Object.freeze(this)
  }

  static create(
    props: TransactionInitProps,
    id?: string
  ): Either<InvalidFields, Transaction> {
    const errors: InvalidFields = []

    const titleOrError = Name.create(props.title)
    const itemsOrError = TransactionItems.create(props.items)
    const payersOrError = TransactionPayers.create(props.payers)

    if (titleOrError.isLeft())
      errors.push({ field: 'title', error: titleOrError.value })
    if (itemsOrError.isLeft())
      errors.push(...FieldKeys.addKeyOnErrorFields('items', itemsOrError.value))
    if (payersOrError.isLeft())
      errors.push(
        ...FieldKeys.addKeyOnErrorFields('payers', payersOrError.value)
      )

    const title = titleOrError.value as Name
    const items = itemsOrError.value as TransactionItems
    const payers = payersOrError.value as TransactionPayers

    const date = new Date(props.timestamp)
    if (isNaN(date.getTime()))
      errors.push({
        field: 'date',
        error: new InvalidError(
          'Date',
          props.timestamp.toString(),
          new FormattingReason()
        )
      })

    const month = DateParser.parseDate(props.timestamp)

    const itemsAmount = Object.entries(props.items).reduce((acc, cur) => {
      return acc + cur[1].amount
    }, 0)

    const totalPaid = Object.entries(props.payers).reduce((acc, cur) => {
      return acc + cur[1]
    }, 0)

    if (itemsAmount.toFixed(2) !== totalPaid.toFixed(2))
      errors.push({
        error: new InvalidError(
          'Payment',
          '',
          new CustomReason('Items values are distinct from total paid.')
        )
      })

    const amountOrError = Amount.create(itemsAmount)
    if (amountOrError.isLeft())
      errors.push({ field: 'amount', error: amountOrError.value })
    const amount = amountOrError.value as Amount

    let related = Object.keys(props.payers)
    for (const item of Object.values(props.items)) {
      related = related.concat(item.related_users)
    }
    related = [...new Set(related)]

    const relatedUsersOrError = RelatedList.create(related)
    const relatedUsers = relatedUsersOrError.value as RelatedList

    if (errors.length > 0) return left(errors)

    return right(
      new Transaction(
        title,
        date,
        items,
        payers,
        month,
        amount,
        relatedUsers,
        id
      )
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
