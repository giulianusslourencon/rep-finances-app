import { InvalidError } from '@entities/errors'

export class InvalidPaymentError implements InvalidError {
  name: string
  value: string
  reason: string

  constructor(itemsValues: string, totalPaid: string) {
    this.name = 'InvalidPaymentError'
    this.value = JSON.stringify({ itemsValues, totalPaid })
    this.reason = 'Items values are distinct from total paid.'
  }
}
