import { v4 as uuid } from 'uuid'

import { Either, left, right } from '@shared/Either'
import DateParser from '@shared/utils/DateParser'

import { Amount } from './Amount'
import { EmptyListError } from './errors/EmptyList'
import { InvalidAmountError } from './errors/InvalidAmount'
import { InvalidRelatedError } from './errors/InvalidRelated'
import { InvalidTimestampError } from './errors/InvalidTimestamp'
import { InvalidTitleError } from './errors/InvalidTitle'
import { InvalidValueError } from './errors/InvalidValue'
import { RelatedList } from './RelatedList'
import { Timestamp } from './Timestamp'
import { Title } from './Title'
import { TransactionItems } from './TransactionItems'
import { TransactionPayers } from './TransactionPayers'

type TransactionProps = {
  title: string
  timestamp: number | string
  items: {
    [title: string]: {
      value: number
      related_users: string[]
    }
  }
  payers: {
    [user: string]: number
  }
}

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
    props: TransactionProps,
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
    const items = itemsOrError.value
    const payers = payersOrError.value

    const itemsValues = items.value.reduce((acc, cur) => {
      return acc + cur[1].value.value
    }, 0)

    const totalPaid = payers.value.reduce((acc, cur) => {
      return acc + cur[1].value
    }, 0)

    if (itemsValues !== totalPaid) return left(new InvalidValueError())

    const amountOrError = Amount.create(itemsValues)
    if (amountOrError.isLeft()) return left(amountOrError.value)

    const amount = amountOrError.value
    const month = DateParser.parseDate(timestamp.value)

    let related = payers.value.map(payer => payer[0])
    items.value.forEach(item => {
      related = related.concat(item[1].related_users.value)
    })
    related = [...new Set(related)]

    const relatedUsersOrError = RelatedList.setList(related)
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
}
