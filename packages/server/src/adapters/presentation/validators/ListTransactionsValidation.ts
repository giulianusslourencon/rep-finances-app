import { HttpRequest } from '@presentation/contracts'
import { MissingParamError } from '@presentation/controllers/errors'
import { ListQueryViewModel } from '@presentation/viewModels'
import * as Yup from 'yup'

import { Either, left, right } from '@shared/Either'

export class ListTransactionsValidation {
  static validate(
    request: HttpRequest<Record<string, never>, ListQueryViewModel>
  ): Either<MissingParamError, ListQueryViewModel> {
    const schema = Yup.object().shape({
      page: Yup.number().integer().positive().optional(),
      nItems: Yup.number().integer().positive().optional(),
      month: Yup.string().length(6).optional()
    })

    try {
      const obj = schema.validateSync(request.query)
      return right(obj)
    } catch (error) {
      return left(new MissingParamError(error.errors[0]))
    }
  }
}
