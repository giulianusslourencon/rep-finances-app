import { HttpRequest } from '@presentation/contracts'
import { GetCurrentBalanceController } from '@presentation/controllers/Balance'

import {
  GetCurrentBalance,
  GetCurrentBalanceResponse
} from '@useCases/ports/Balance'

interface ISutType {
  sut: GetCurrentBalanceController
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
  const sut = new GetCurrentBalanceController(getCurrentBalanceStub)
  return { sut, getCurrentBalanceStub }
}

describe('Get current balance controller', () => {
  it('Should return the current balance of all registered transactions', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      query: {},
      body: {},
      params: {}
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      balance: { P: 20, G: -15, F: -5 }
    })
  })

  it('Should return 500 if use case throws', async () => {
    const { sut, getCurrentBalanceStub } = makeSut()
    jest.spyOn(getCurrentBalanceStub, 'execute').mockImplementation(() => {
      throw new Error()
    })

    const httpRequest: HttpRequest = {
      query: {},
      body: {},
      params: {}
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual({
      name: 'ServerError',
      message: 'Server error: Unexpected error.'
    })
  })

  it('Should return 500 if use case throws with custom reason', async () => {
    const { sut, getCurrentBalanceStub } = makeSut()
    jest.spyOn(getCurrentBalanceStub, 'execute').mockImplementation(() => {
      throw new Error('Error')
    })

    const httpRequest: HttpRequest = {
      query: {},
      body: {},
      params: {}
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual({
      name: 'ServerError',
      message: 'Server error: Error.'
    })
  })
})
