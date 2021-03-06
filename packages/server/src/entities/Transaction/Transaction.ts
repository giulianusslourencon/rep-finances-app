import { v4 as uuid } from 'uuid'

import { Amount, Label } from '@entities/atomics'
import {
  InvalidAmountError,
  InvalidUserIdError,
  InvalidDateError,
  InvalidLabelError
} from '@entities/atomics/errors'
import {
  TransactionProps,
  RelatedList,
  TransactionItems,
  TransactionPayers,
  TransactionInitProps
} from '@entities/Transaction'
import {
  InvalidPaymentError,
  EmptyListError
} from '@entities/Transaction/errors'

import { Either, left, right } from '@shared/Either'
import DateParser from '@shared/utils/DateParser'

export class Transaction {
  public readonly _id!: string

  public title!: Label
  public date!: Date
  public items!: TransactionItems
  public payers!: TransactionPayers

  public readonly month!: string
  public readonly amount!: Amount
  public readonly related!: RelatedList

  private constructor(
    title: Label,
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
  ): Either<
    | InvalidLabelError
    | InvalidDateError
    | InvalidUserIdError
    | InvalidAmountError
    | EmptyListError
    | InvalidPaymentError,
    Transaction
  > {
    const titleOrError = Label.create(props.title)
    const itemsOrError = TransactionItems.create(props.items)
    const payersOrError = TransactionPayers.create(props.payers)

    if (titleOrError.isLeft()) return left(titleOrError.value)
    if (itemsOrError.isLeft()) return left(itemsOrError.value)
    if (payersOrError.isLeft()) return left(payersOrError.value)

    const title = titleOrError.value

    const date = new Date(props.timestamp)
    if (isNaN(date.getTime()))
      return left(new InvalidDateError(props.timestamp.toString()))
    const month = DateParser.parseDate(props.timestamp)

    const items = itemsOrError.value
    const payers = payersOrError.value

    const itemsAmount = Object.entries(items.value).reduce((acc, cur) => {
      return acc + cur[1].amount
    }, 0)

    const totalPaid = Object.entries(payers.value).reduce((acc, cur) => {
      return acc + cur[1]
    }, 0)

    if (itemsAmount.toFixed(2) !== totalPaid.toFixed(2))
      return left(new InvalidPaymentError())

    const amountOrError = Amount.create(itemsAmount)
    if (amountOrError.isLeft()) return left(amountOrError.value)
    const amount = amountOrError.value

    let related = Object.keys(payers.value)
    for (const item of Object.values(items.value)) {
      related = related.concat(item.related_users)
    }
    related = [...new Set(related)]

    const relatedUsersOrError = RelatedList.create(related)
    if (relatedUsersOrError.isLeft()) return left(relatedUsersOrError.value)

    const relatedUsers = relatedUsersOrError.value

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
