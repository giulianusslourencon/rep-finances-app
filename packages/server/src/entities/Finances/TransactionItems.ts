import { Amount, Name } from '@entities/components'
import { InvalidError } from '@entities/errors'
import { DuplicateReason, EmptyReason } from '@entities/errors/reasons'
import { RelatedList } from '@entities/Finances'

import { Either, left, right } from '@shared/types'

type ValidatedItems = [Name, { amount: Amount; related_users: RelatedList }][]

export type TransactionItemsProps = {
  [name: string]: {
    amount: number
    related_users: string[]
  }
}

export class TransactionItems {
  private readonly items: ValidatedItems

  private constructor(items: ValidatedItems) {
    this.items = [...items]
    Object.freeze(this)
  }

  static create(
    items: TransactionItemsProps
  ): Either<InvalidError, TransactionItems> {
    const finalList: ValidatedItems = []
    for (const [name, { amount, related_users }] of Object.entries(items)) {
      const nameOrError = Name.create(name)
      const amountOrError = Amount.create(amount)
      const relatedUsersOrError = RelatedList.create(related_users)

      if (nameOrError.isLeft()) return left(nameOrError.value)
      if (amountOrError.isLeft()) return left(amountOrError.value)
      if (relatedUsersOrError.isLeft()) return left(relatedUsersOrError.value)

      const duplicated = finalList.filter(
        item => item[0].value === nameOrError.value.value
      )
      if (duplicated.length > 0)
        return left(
          new InvalidError(
            'Transaction Items',
            nameOrError.value.value,
            new DuplicateReason('name')
          )
        )

      finalList.push([
        nameOrError.value,
        {
          amount: amountOrError.value,
          related_users: relatedUsersOrError.value
        }
      ])
    }

    if (!TransactionItems.validate(finalList))
      return left(new InvalidError('Transaction Items', '', new EmptyReason()))

    return right(new TransactionItems(finalList))
  }

  get value(): TransactionItemsProps {
    const items: TransactionItemsProps = {}
    for (const [name, { amount, related_users }] of this.items) {
      items[name.value] = {
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
