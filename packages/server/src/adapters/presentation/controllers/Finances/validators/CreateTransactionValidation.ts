import { HttpRequest } from '@presentation/contracts'
import { MissingParamsError } from '@presentation/controllers/errors'
import { CreateTransactionViewModel } from '@presentation/viewModels/Finances'
import * as Yup from 'yup'

import { Either, left, right } from '@shared/types'

export class CreateTransactionValidation {
  static validate(
    request: HttpRequest<CreateTransactionViewModel>
  ): Either<MissingParamsError, CreateTransactionViewModel> {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      timestamp: Yup.number().required(),
      items: Yup.array()
        .transform((_, orig) => Object.values(orig))
        .of(
          Yup.object({
            amount: Yup.number().required(),
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
      const yupError = error as Yup.ValidationError
      return left(new MissingParamsError(yupError.errors))
    }
  }
}
