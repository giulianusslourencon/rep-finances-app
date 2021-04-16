import { Path } from '@shared/utils'

import { Amount, Name } from '@entities/components'
import { EntityErrorHandler, InvalidError } from '@entities/errors'
import { DuplicateReason, EmptyReason } from '@entities/errors/reasons'
import { RelatedList } from '@entities/Finances'

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
    items: TransactionItemsProps,
    errorHandler: EntityErrorHandler,
    path = new Path()
  ): TransactionItems {
    const finalList: ValidatedItems = []
    for (const [name, { amount, related_users }] of Object.entries(items)) {
      const itemName = Name.create(name, errorHandler, path.add(`${name}.name`))
      const itemAmount = Amount.create(
        amount,
        errorHandler,
        path.add(`${name}.amount`)
      )
      const relatedUsers = RelatedList.create(
        related_users,
        errorHandler,
        path.add(`${name}.related_users`)
      )

      const duplicated = finalList.filter(
        item => item[0].value === itemName.value
      )
      if (duplicated.length > 0)
        errorHandler.addError(
          new InvalidError(
            'Transaction Items',
            itemName.value,
            new DuplicateReason('name')
          ),
          path.add(name).resolve()
        )

      finalList.push([
        itemName,
        {
          amount: itemAmount,
          related_users: relatedUsers
        }
      ])
    }

    if (!TransactionItems.validate(finalList))
      errorHandler.addError(
        new InvalidError('Transaction Items', '', new EmptyReason()),
        path.resolve()
      )

    return new TransactionItems(finalList)
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
