import { HttpRequest } from '@presentation/contracts'
import { MissingParamsError } from '@presentation/controllers/errors'
import { ListQueryViewModel } from '@presentation/viewModels/Finances'
import * as Yup from 'yup'

import { Either, left, right } from '@shared/types'

export class ListTransactionsValidation {
  static validate(
    request: HttpRequest<Record<string, never>, ListQueryViewModel>
  ): Either<MissingParamsError, ListQueryViewModel> {
    const schema = Yup.object().shape({
      page: Yup.number().integer().positive().optional(),
      nItems: Yup.number().integer().positive().optional(),
      month: Yup.string().length(6).optional()
    })

    try {
      const obj = schema.validateSync(request.query)
      return right(obj)
    } catch (error) {
      const yupError = error as Yup.ValidationError
      return left(new MissingParamsError(yupError.errors))
    }
  }
}
