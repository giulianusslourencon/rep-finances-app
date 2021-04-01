import { InvalidTransactionItemsError } from '@entities/Finances/errors'

export class InvalidTransactionItemsDuplicateUser extends InvalidTransactionItemsError {
  constructor(duplicateItemName: string) {
    super(duplicateItemName, 'There cannot be two items with the same name.')
  }
}
