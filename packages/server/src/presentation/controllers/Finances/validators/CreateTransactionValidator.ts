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
  private format(data: CreateTransactionViewModel): CreateTransactionViewModel {
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

  private recordToArray = (cur: unknown, orig: unknown, field: string) => {
    if (orig instanceof Object && !(orig instanceof Array))
      return Object.values(orig)
    throw new Yup.ValidationError(field + ' must be an `object` type')
  }

  validate(
    request: HttpRequest<CreateTransactionViewModel>
  ): Either<InvalidInputError, HttpRequest<CreateTransactionViewModel>> {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      timestamp: Yup.number().required(),
      items: Yup.array()
        .transform((cur, orig) => this.recordToArray(cur, orig, 'items'))
        .of(
          Yup.object({
            amount: Yup.number().required(),
            related_users: Yup.array()
              .typeError(params => `${params.path} must be a \`array\` type`)
              .of(Yup.string())
              .min(1)
              .required()
          })
        )
        .min(1)
        .required(),
      payers: Yup.array()
        .transform((cur, orig) => this.recordToArray(cur, orig, 'payers'))
        .of(Yup.number().required())
        .min(1)
        .required()
    })

    try {
      schema.validateSync(request.body)
      request.body = this.format(request.body)
      return right(request)
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return left(new InvalidInputError(error.errors))
      }
      return left(new InvalidInputError(['unexpected error']))
    }
  }
}
