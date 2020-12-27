import { HttpRequest } from '@presentation/contracts'
import { ListTransactionsController } from '@presentation/controllers/Transactions'

import {
  ListTransactions,
  ListTransactionsProps,
  ListTransactionsResponse
} from '@useCases/ports/Transactions'

interface ISutType {
  sut: ListTransactionsController
  listTransactionsStub: ListTransactions
}

const makeListTransactionsStub = (): ListTransactions => {
  class ListTransactionsStub implements ListTransactions {
    async execute(
      _props: ListTransactionsProps
    ): Promise<ListTransactionsResponse> {
      const transactionsToReturn: ListTransactionsResponse = [
        {
          _id: 'id',
          amount: 10,
          related: ['a'],
          date: new Date(20),
          title: 'A'
        }
      ]

      return Promise.resolve(transactionsToReturn)
    }
  }

  return new ListTransactionsStub()
}

const makeSut = (): ISutType => {
  const listTransactionsStub = makeListTransactionsStub()
  const sut = new ListTransactionsController(listTransactionsStub)
  return { sut, listTransactionsStub }
}

describe('List transactions controller', () => {
  it('Should return all transactions registered', async () => {
    const { sut, listTransactionsStub } = makeSut()
    const httpRequest: HttpRequest = {
      query: {},
      body: {},
      params: {}
    }
    const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({})
  })

  it('Should return all transactions registered with skip and limit', async () => {
    const { sut, listTransactionsStub } = makeSut()
    const httpRequest: HttpRequest = {
      query: { skip: 0, limit: 2 },
      body: {},
      params: {}
    }
    const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
      skipLimit: { limit: 2, skip: 0 }
    })
  })

  it('Should return all transactions registered if just skip is passed without limit', async () => {
    const { sut, listTransactionsStub } = makeSut()
    const httpRequest: HttpRequest = {
      query: { skip: 0 },
      body: {},
      params: {}
    }
    const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({})
  })

  it('Should return all transactions registered if just limit is passed without skip', async () => {
    const { sut, listTransactionsStub } = makeSut()
    const httpRequest: HttpRequest = {
      query: { limit: 2 },
      body: {},
      params: {}
    }
    const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({})
  })

  it('Should return all transactions registered by month', async () => {
    const { sut, listTransactionsStub } = makeSut()
    const httpRequest: HttpRequest = {
      query: { month: '202012' },
      body: {},
      params: {}
    }
    const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
      month: '202012'
    })
  })

  it('Should return all transactions registered by month with skip and limit', async () => {
    const { sut, listTransactionsStub } = makeSut()
    const httpRequest: HttpRequest = {
      query: { month: '202012', skip: 0, limit: 2 },
      body: {},
      params: {}
    }
    const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
      month: '202012',
      skipLimit: { skip: 0, limit: 2 }
    })
  })

  it('Should return 500 if use case throws', async () => {
    const { sut, listTransactionsStub } = makeSut()
    jest.spyOn(listTransactionsStub, 'execute').mockImplementation(() => {
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
    const { sut, listTransactionsStub } = makeSut()
    jest.spyOn(listTransactionsStub, 'execute').mockImplementation(() => {
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
