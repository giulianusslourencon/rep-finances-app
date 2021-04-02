import { Amount, Name } from '@entities/components'
import { FieldKeys, InvalidError, InvalidFields } from '@entities/errors'
import { DuplicateReason, EmptyReason } from '@entities/errors/reasons'
import { RelatedList } from '@entities/Finances'

import { Either, right } from '@shared/types'

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
  ): Either<InvalidFields, TransactionItems> {
    const finalList: ValidatedItems = []
    const errors: InvalidFields = []
    for (const [name, { amount, related_users }] of Object.entries(items)) {
      const nameOrError = Name.create(name)
      const amountOrError = Amount.create(amount)
      const relatedUsersOrError = RelatedList.create(related_users)

      if (nameOrError.isLeft())
        errors.push({
          field: `${name}.name`,
          error: nameOrError.value
        })
      if (amountOrError.isLeft())
        errors.push({
          field: `${name}.amount`,
          error: amountOrError.value
        })
      if (relatedUsersOrError.isLeft())
        errors.concat(
          FieldKeys.addKeyOnErrorFields(
            'related_users',
            relatedUsersOrError.value
          )
        )

      const duplicated = finalList.filter(
        item => item[0].value === nameOrError.value.value
      )
      if (duplicated.length > 0)
        errors.push({
          field: name,
          error: new InvalidError(
            'Transaction Items',
            nameOrError.value.value,
            new DuplicateReason('name')
          )
        })

      if (errors.length === 0)
        finalList.push([
          nameOrError.value as Name,
          {
            amount: amountOrError.value as Amount,
            related_users: relatedUsersOrError.value as RelatedList
          }
        ])
    }

    if (!TransactionItems.validate(finalList))
      errors.push({
        error: new InvalidError('Transaction Items', '', new EmptyReason())
      })

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
