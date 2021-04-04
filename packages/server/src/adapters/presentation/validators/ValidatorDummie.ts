import { HttpRequest, IValidator } from '@presentation/contracts'
import { InvalidInputError } from '@presentation/controllers/errors'

import { Either, right } from '@shared/types'

export class ValidatorDummie implements IValidator {
  validate(_request: HttpRequest): Either<InvalidInputError, null> {
    return right(null)
  }
}
