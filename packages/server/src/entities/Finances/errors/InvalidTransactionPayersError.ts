import { InvalidError } from '@entities/errors'

export class InvalidTransactionPayersError implements InvalidError {
  name: string
  value: string
  reason: string

  constructor(value: string, reason: string) {
    this.name = 'InvalidTransactionPayersError'
    this.value = value
    this.reason = reason
  }
}
