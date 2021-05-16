import {
  Controller,
  IControllerOperation,
  IValidator,
  HttpRequest,
  HttpResponse
} from '@presentation/contracts'
import { InvalidInputError } from '@presentation/controllers/errors'
import {
  success,
  invalidInputError,
  serverError
} from '@presentation/controllers/helpers'

import { Either, right, left } from '@shared/types'

import { HttpRequestBuilder } from '@tests/builders'

interface ISutType {
  sut: Controller
  operationStub: IControllerOperation
  validatorStub: IValidator
}

const makeValidatorStub = (): IValidator => {
  class ValidatorStub implements IValidator {
    validate(request: HttpRequest): Either<InvalidInputError, HttpRequest> {
      return right(request)
    }
  }

  return new ValidatorStub()
}

const makeOperationStub = (): IControllerOperation => {
  class OperationStub implements IControllerOperation {
    validator = makeValidatorStub()
    async operate(_request: HttpRequest): Promise<HttpResponse> {
      return success('Success')
    }
  }

  return new OperationStub()
}

const makeSut = (): ISutType => {
  const operationStub = makeOperationStub()
  const validatorStub = operationStub.validator
  const sut = new Controller(operationStub)

  return { sut, operationStub, validatorStub }
}

describe('Controller', () => {
  describe('Success Cases', () => {
    it('Should return the operation response if the request pass the validation', async () => {
      const { sut } = makeSut()

      const httpResponse = await sut.handle(
        HttpRequestBuilder.anHttpRequest().build()
      )

      expect(httpResponse).toEqual(success('Success'))
    })

    it('Should return a invalid input error if the request dont pass the validation', async () => {
      const { sut, validatorStub } = makeSut()

      jest.spyOn(validatorStub, 'validate').mockImplementation(() => {
        return left(new InvalidInputError(['field']))
      })

      const httpResponse = await sut.handle(
        HttpRequestBuilder.anHttpRequest().build()
      )

      expect(httpResponse).toEqual(
        invalidInputError(new InvalidInputError(['field']))
      )
    })
  })

  describe('Error Cases', () => {
    it('Should return a connection error if the use case throws', async () => {
      const { sut, operationStub } = makeSut()

      jest.spyOn(operationStub, 'operate').mockImplementation(async () => {
        throw new Error()
      })

      const httpResponse = await sut.handle(
        HttpRequestBuilder.anHttpRequest().build()
      )

      expect(httpResponse).toEqual(serverError())
    })

    it('Should return a connection error if the use case throws with custom reason', async () => {
      const { sut, operationStub } = makeSut()

      jest.spyOn(operationStub, 'operate').mockImplementation(async () => {
        throw new Error('Reason')
      })

      const httpResponse = await sut.handle(
        HttpRequestBuilder.anHttpRequest().build()
      )

      expect(httpResponse).toEqual(serverError('Reason'))
    })
  })
})
