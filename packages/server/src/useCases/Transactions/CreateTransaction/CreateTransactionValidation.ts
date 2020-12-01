import { Request } from 'express'
import * as Yup from 'yup'

export class CreateTransactionValidation {
  public validate(request: Request) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      timestamp: Yup.number().required(),
      items: Yup.array()
        .transform((_, orig) => Object.values(orig))
        .of(Yup.object({
          value: Yup.number().required(),
          related_users: Yup.array().of(Yup.string()).min(1)
        }))
        .min(1).required(),
      payers: Yup.array()
        .transform((_, orig) => Object.values(orig))
        .of(Yup.number().required())
        .min(1).required()
    })

    return schema.isValidSync(request.body)
  }
}