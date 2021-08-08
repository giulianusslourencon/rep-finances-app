import { IErrorReason } from '@errors/contracts'

import { StringCapitalizer } from '@shared/utils'

export class InvalidError {
  name: string
  value: string
  reason: string

  constructor(entity: string, value: string, reason: IErrorReason) {
    this.name = `Invalid${StringCapitalizer.capitalizeFirstLetter(
      entity
    ).replace(/\s/g, '')}Error`
    this.value = value
    this.reason = reason.describe(entity)
  }
}
