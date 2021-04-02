import { StringCapitalizer } from '@shared/utils'

import { UseCaseError } from '@useCases/errors'

export class NotFoundError implements UseCaseError {
  name: string
  key: string
  value: string
  message: string

  constructor(entity: string, key: string, value: string) {
    this.name = `${StringCapitalizer.capitalizeFirstLetter(
      entity
    )}NotFoundError`
    this.key = key
    this.value = value
    this.message = `There is no ${entity.toLowerCase()} registered with ${key} "${value}"`
  }
}
