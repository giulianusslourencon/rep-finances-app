import { HttpRequest, IValidator } from '@presentation/contracts'
import { InvalidInputError } from '@presentation/controllers/errors'
import { ListQueryViewModel } from '@presentation/viewModels/Finances'
import * as Yup from 'yup'

import { Either, left, right } from '@shared/types'

export class ListTransactionsValidator implements IValidator {
  validate(
    request: HttpRequest<Record<string, never>, ListQueryViewModel>
  ): Either<
    InvalidInputError,
    HttpRequest<Record<string, never>, ListQueryViewModel>
  > {
    const schema = Yup.object().shape({
      page: Yup.number().integer().positive().optional(),
      nItems: Yup.number().integer().positive().optional(),
      month: Yup.string()
        .trim()
        .matches(/^\d{6}$/, 'month must be a number of exactly 6 positions')
        .optional()
    })

    try {
      const obj = schema.validateSync(request.query)
      request.query = obj
      return right(request)
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return left(new InvalidInputError(error.errors))
      }
      return left(new InvalidInputError(['unexpected error']))
    }
  }
}
