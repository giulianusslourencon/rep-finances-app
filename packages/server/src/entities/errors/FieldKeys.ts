import { InvalidFields } from '@entities/errors'

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
