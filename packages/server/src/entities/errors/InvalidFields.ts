import { InvalidError } from '@entities/errors'

export type InvalidFields = {
  field?: string
  error: InvalidError
}[]

export class FieldKeys {
  static addKeyOnErrorFields(
    key: string,
    errors: InvalidFields
  ): InvalidFields {
    return errors.map(error => {
      return {
        error: error.error,
        field: `${key}${error.field ? `.${error.field}` : ''}`
      }
    })
  }
}
