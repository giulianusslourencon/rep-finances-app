import { GetCurrentBalanceControllerOperation } from '@presentation/controllers/Finances/operations'

import { HttpRequestBuilder } from '@tests/__helpers__/builders'

import {
  GetCurrentBalance,
  GetCurrentBalanceResponse
} from '@useCases/Finances/ports/GetCurrentBalance'

interface ISutType {
  sut: GetCurrentBalanceControllerOperation
  getCurrentBalanceStub: GetCurrentBalance
}

const makeGetCurrentBalanceStub = (): GetCurrentBalance => {
  class GetCurrentBalanceStub implements GetCurrentBalance {
    async execute(): Promise<GetCurrentBalanceResponse> {
      return Promise.resolve({ individual_balance: { P: 20, G: -15, F: -5 } })
    }
  }

  return new GetCurrentBalanceStub()
}

const makeSut = (): ISutType => {
  const getCurrentBalanceStub = makeGetCurrentBalanceStub()
  const sut = new GetCurrentBalanceControllerOperation(getCurrentBalanceStub)

  return { sut, getCurrentBalanceStub }
}

describe('Get Current Balance Controller', () => {
  describe('Success Cases', () => {
    it('Should return 200 with the current balance of all registered transactions', async () => {
      const { sut } = makeSut()

      const httpRequest = HttpRequestBuilder.anHttpRequest().build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body).toEqual({
        balance: { P: 20, G: -15, F: -5 }
      })
    })
  })
})
