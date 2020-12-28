import { DomainError } from '@entities/errors'

export class DuplicatedItemNameOnTransactionError
  extends Error
  implements DomainError {
  constructor(itemName: string) {
    super(`Item with name ${itemName} is duplicated.`)
    this.name = 'DuplicatedItemNameOnTransactionError'
  }
}
