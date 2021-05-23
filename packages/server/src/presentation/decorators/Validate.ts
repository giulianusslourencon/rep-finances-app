import {
  HttpRequest,
  IControllerOperation,
  IValidator
} from '@presentation/contracts'
import { invalidInputError } from '@presentation/controllers/helpers'

export const validate = (validator: IValidator) => {
  return (
    _target: IControllerOperation,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value

    descriptor.value = function (httpRequest: HttpRequest) {
      const validationResult = validator.validate(httpRequest)
      if (validationResult.isLeft())
        return invalidInputError(validationResult.value)

      return originalMethod.apply(this, [validationResult.value])
    }

    return descriptor
  }
}
