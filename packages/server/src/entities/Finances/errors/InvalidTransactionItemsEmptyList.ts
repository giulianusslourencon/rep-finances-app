import { InvalidTransactionItemsError } from '@entities/Finances/errors'

export class InvalidTransactionItemsEmptyList extends InvalidTransactionItemsError {
  constructor() {
    super('[]', 'There must be at least one item.')
  }
}
