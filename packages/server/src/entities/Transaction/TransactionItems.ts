import { Amount, Title } from '@entities/atomics'
import {
  InvalidAmountError,
  InvalidRelatedError,
  InvalidTitleError
} from '@entities/atomics/errors'
import { TransactionItemsProps } from '@entities/Transaction'
import { EmptyListError } from '@entities/Transaction/errors'
import { RelatedList } from '@entities/Transaction/RelatedList'

import { Either, left, right } from '@shared/Either'

type ValidatedItems = [Title, { value: Amount; related_users: RelatedList }][]

export class TransactionItems {
  private readonly items: ValidatedItems

  private constructor(items: ValidatedItems) {
    this.items = [...items]
    Object.freeze(this)
  }

  static create(
    items: TransactionItemsProps
  ): Either<
    | InvalidTitleError
    | InvalidAmountError
    | InvalidRelatedError
    | EmptyListError,
    TransactionItems
  > {
    const finalList: ValidatedItems = []
    for (const [title, { value, related_users }] of Object.entries(items)) {
      const titleOrError = Title.create(title)
      const valueOrError = Amount.create(value)
      const relatedUsersOrError = RelatedList.create(related_users)

      if (titleOrError.isLeft()) return left(titleOrError.value)
      if (valueOrError.isLeft()) return left(valueOrError.value)
      if (relatedUsersOrError.isLeft()) return left(relatedUsersOrError.value)

      finalList.push([
        titleOrError.value,
        { value: valueOrError.value, related_users: relatedUsersOrError.value }
      ])
    }

    if (!TransactionItems.validate(finalList)) return left(new EmptyListError())

    return right(new TransactionItems(finalList))
  }

  get value(): TransactionItemsProps {
    const items: TransactionItemsProps = {}
    for (const [title, { value, related_users }] of this.items) {
      items[title.value] = {
        value: value.value,
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
