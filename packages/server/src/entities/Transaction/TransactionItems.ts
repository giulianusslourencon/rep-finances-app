import { Amount, Label } from '@entities/atomics'
import {
  InvalidAmountError,
  InvalidUserIdError,
  InvalidLabelError
} from '@entities/atomics/errors'
import { TransactionItemsProps } from '@entities/Transaction'
import { EmptyListError } from '@entities/Transaction/errors'
import { RelatedList } from '@entities/Transaction/RelatedList'

import { Either, left, right } from '@shared/Either'

type ValidatedItems = [Label, { amount: Amount; related_users: RelatedList }][]

export class TransactionItems {
  private readonly items: ValidatedItems

  private constructor(items: ValidatedItems) {
    this.items = [...items]
    Object.freeze(this)
  }

  static create(
    items: TransactionItemsProps
  ): Either<
    | InvalidLabelError
    | InvalidAmountError
    | InvalidUserIdError
    | EmptyListError,
    TransactionItems
  > {
    const finalList: ValidatedItems = []
    for (const [label, { amount, related_users }] of Object.entries(items)) {
      const labelOrError = Label.create(label)
      const amountOrError = Amount.create(amount)
      const relatedUsersOrError = RelatedList.create(related_users)

      if (labelOrError.isLeft()) return left(labelOrError.value)
      if (amountOrError.isLeft()) return left(amountOrError.value)
      if (relatedUsersOrError.isLeft()) return left(relatedUsersOrError.value)

      finalList.push([
        labelOrError.value,
        {
          amount: amountOrError.value,
          related_users: relatedUsersOrError.value
        }
      ])
    }

    if (!TransactionItems.validate(finalList)) return left(new EmptyListError())

    return right(new TransactionItems(finalList))
  }

  get value(): TransactionItemsProps {
    const items: TransactionItemsProps = {}
    for (const [label, { amount, related_users }] of this.items) {
      items[label.value] = {
        amount: amount.value,
        related_users: related_users.value
      }
    }
    return items
  }

  static validate(items: ValidatedItems): boolean {
    if (items.length === 0) return false
    return true
  }
}
