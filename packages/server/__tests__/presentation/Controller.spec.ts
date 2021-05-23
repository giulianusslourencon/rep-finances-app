import {
  HttpRequest,
  HttpResponse,
  IControllerOperation
} from '@presentation/contracts'
import { Controller } from '@presentation/controllers'
import { serverError, success } from '@presentation/controllers/helpers'

import { HttpRequestBuilder } from '@tests/__helpers__/builders'

interface ISutType {
  sut: Controller
  operationStub: IControllerOperation
}

const makeOperationStub = (): IControllerOperation => {
  class OperationStub implements IControllerOperation {
    async operate(_request: HttpRequest): Promise<HttpResponse> {
      return success('Success')
    }
  }

  return new OperationStub()
}

const makeSut = (): ISutType => {
  const operationStub = makeOperationStub()
  const sut = new Controller(operationStub)

  return { sut, operationStub }
}

describe('Controller', () => {
  describe('Success Cases', () => {
    it('Should return the operation response', async () => {
      const { sut } = makeSut()

      const httpResponse = await sut.handle(
        HttpRequestBuilder.anHttpRequest().build()
      )

      expect(httpResponse).toEqual(success('Success'))
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
