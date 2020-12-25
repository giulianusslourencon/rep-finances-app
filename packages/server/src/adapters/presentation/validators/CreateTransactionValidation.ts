import { HttpRequest } from '@presentation/contracts'
import { MissingParamError } from '@presentation/controllers/errors'
import { CreateTransactionViewModel } from '@presentation/viewModels'
import * as Yup from 'yup'

import { Either, left, right } from '@shared/Either'

export class CreateTransactionValidation {
  static validate(
    request: HttpRequest<CreateTransactionViewModel>
  ): Either<MissingParamError, CreateTransactionViewModel> {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      timestamp: Yup.number().required(),
      items: Yup.array()
        .transform((_, orig) => Object.values(orig))
        .of(
          Yup.object({
            value: Yup.number().required(),
            related_users: Yup.array().of(Yup.string())
          })
        )
        .required(),
      payers: Yup.array()
        .transform((_, orig) => Object.values(orig))
        .of(Yup.number().required())
        .required()
    })

    try {
      const obj = schema.validateSync(request.body)
      return right(obj)
    } catch (error) {
      return left(new MissingParamError(error.errors[0]))
    }
  }
}
