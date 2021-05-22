import { HttpRequest } from '@presentation/contracts'
import { InvalidInputError } from '@presentation/controllers/errors'

import { Either } from '@shared/types'

export interface IValidator {
  validate(request: HttpRequest): Either<InvalidInputError, HttpRequest>
}
