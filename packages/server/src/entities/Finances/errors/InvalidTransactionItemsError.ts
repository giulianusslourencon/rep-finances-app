import { InvalidError } from '@entities/errors'

export class InvalidTransactionItemsError implements InvalidError {
  name: string
  value: string
  reason: string

  constructor(value: string, reason: string) {
    this.name = 'InvalidTransactionItemsError'
    this.value = value
    this.reason = reason
  }
}
