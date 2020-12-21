import { TransactionItemsProps } from '@shared/@types/Transaction'
import { Either, left, right } from '@shared/Either'

import { Amount } from '../atomics/Amount'
import { InvalidAmountError } from '../atomics/errors/InvalidAmount'
import { InvalidRelatedError } from '../atomics/errors/InvalidRelated'
import { InvalidTitleError } from '../atomics/errors/InvalidTitle'
import { Title } from '../atomics/Title'
import { EmptyListError } from './errors/EmptyList'
import { RelatedList } from './RelatedList'

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
