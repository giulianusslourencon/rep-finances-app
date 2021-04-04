import { HttpRequest } from '@presentation/contracts'
import { InvalidInputError } from '@presentation/controllers/errors'

import { Either } from '@shared/types'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IValidator<T = any> {
  validate(request: HttpRequest): Either<InvalidInputError, T>
}
