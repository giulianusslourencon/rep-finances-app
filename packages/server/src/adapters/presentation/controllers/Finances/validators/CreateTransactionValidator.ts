import { HttpRequest, IValidator } from '@presentation/contracts'
import { InvalidInputError } from '@presentation/controllers/errors'
import { CreateTransactionViewModel } from '@presentation/viewModels/Finances'
import * as Yup from 'yup'

import { Either, left, right } from '@shared/types'

import {
  TransactionItemsProps,
  TransactionPayersProps
} from '@entities/Finances'

export class CreateTransactionValidator implements IValidator {
  format(data: CreateTransactionViewModel): CreateTransactionViewModel {
    const items: TransactionItemsProps = {}
    for (const [key, value] of Object.entries(data.items)) {
      items[key] = {
        amount: parseFloat(value.amount.toString()),
        related_users: value.related_users.map(user => user.toString())
      }
    }

    const payers: TransactionPayersProps = {}
    for (const [key, value] of Object.entries(data.payers)) {
      payers[key] = parseFloat(value.toString())
    }

    return {
      title: data.title.toString(),
      timestamp: parseInt(data.timestamp.toString()),
      items,
      payers
    }
  }

  validate(
    request: HttpRequest<CreateTransactionViewModel>
  ): Either<InvalidInputError, HttpRequest<CreateTransactionViewModel>> {
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
      schema.validateSync(request.body)
      request.body = this.format(request.body)
      return right(request)
    } catch (error) {
      const yupError = error as Yup.ValidationError
      return left(new InvalidInputError(yupError.errors))
    }
  }
}
