import { v4 as uuid } from 'uuid'

import {
  TransactionInitProps,
  TransactionProps
} from '@shared/@types/Transaction'
import { Either, left, right } from '@shared/Either'
import DateParser from '@shared/utils/DateParser'

import { Amount } from '../atomics/Amount'
import { InvalidAmountError } from '../atomics/errors/InvalidAmount'
import { InvalidRelatedError } from '../atomics/errors/InvalidRelated'
import { InvalidTimestampError } from '../atomics/errors/InvalidTimestamp'
import { InvalidTitleError } from '../atomics/errors/InvalidTitle'
import { Timestamp } from '../atomics/Timestamp'
import { Title } from '../atomics/Title'
import { EmptyListError } from './errors/EmptyList'
import { InvalidValueError } from './errors/InvalidValue'
import { RelatedList } from './RelatedList'
import { TransactionItems } from './TransactionItems'
import { TransactionPayers } from './TransactionPayers'

export class Transaction {
  public readonly _id!: string

  public title!: Title
  public timestamp!: Timestamp
  public items!: TransactionItems
  public payers!: TransactionPayers

  public readonly month!: string
  public readonly amount!: Amount
  public readonly related!: RelatedList

  private constructor(
    title: Title,
    timestamp: Timestamp,
    items: TransactionItems,
    payers: TransactionPayers,
    month: string,
    amount: Amount,
    related: RelatedList,
    id?: string
  ) {
    this.title = title
    this.timestamp = timestamp
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
    | InvalidTitleError
    | InvalidTimestampError
    | InvalidRelatedError
    | InvalidAmountError
    | EmptyListError
    | InvalidValueError,
    Transaction
  > {
    const titleOrError = Title.create(props.title)
    const timestampOrError = Timestamp.create(props.timestamp)
    const itemsOrError = TransactionItems.create(props.items)
    const payersOrError = TransactionPayers.create(props.payers)

    if (titleOrError.isLeft()) return left(titleOrError.value)
    if (timestampOrError.isLeft()) return left(timestampOrError.value)
    if (itemsOrError.isLeft()) return left(itemsOrError.value)
    if (payersOrError.isLeft()) return left(payersOrError.value)

    const title = titleOrError.value

    const timestamp = timestampOrError.value
    const month = DateParser.parseDate(timestamp.value)

    const items = itemsOrError.value
    const payers = payersOrError.value

    const itemsValues = Object.entries(items.value).reduce((acc, cur) => {
      return acc + cur[1].value
    }, 0)

    const totalPaid = Object.entries(payers.value).reduce((acc, cur) => {
      return acc + cur[1]
    }, 0)

    if (itemsValues !== totalPaid) return left(new InvalidValueError())

    const amountOrError = Amount.create(itemsValues)
    if (amountOrError.isLeft()) return left(amountOrError.value)
    const amount = amountOrError.value

    let related = Object.keys(payers.value)
    Object.values(items.value).forEach(item => {
      related = related.concat(item.related_users)
    })
    related = [...new Set(related)]

    const relatedUsersOrError = RelatedList.create(related)
    if (relatedUsersOrError.isLeft()) return left(relatedUsersOrError.value)

    const relatedUsers = relatedUsersOrError.value

    return right(
      new Transaction(
        title,
        timestamp,
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
      timestamp: this.timestamp.value,
      items: this.items.value,
      payers: this.payers.value,
      month: this.month,
      amount: this.amount.value,
      related: this.related.value
    }
  }
}
