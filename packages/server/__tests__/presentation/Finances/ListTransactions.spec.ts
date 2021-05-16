import { ListTransactionsControllerOperation } from '@presentation/controllers/Finances/operations'

import { HttpRequestBuilder } from '@tests/builders'

import {
  ListTransactions,
  ListTransactionsProps,
  ListTransactionsResponse
} from '@useCases/Finances/ports/ListTransactions'

interface ISutType {
  sut: ListTransactionsControllerOperation
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
  const sut = new ListTransactionsControllerOperation(listTransactionsStub)

  return { sut, listTransactionsStub }
}

describe('List Transactions Controller', () => {
  describe('Success Cases', () => {
    it('Should return a list with default items number per page and page 1', async () => {
      const { sut, listTransactionsStub } = makeSut()

      const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

      const httpRequest = HttpRequestBuilder.anHttpRequest().build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(200)
      expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
        skipLimit: { limit: 15, skip: 0 }
      })
    })

    it('Should return a list with default items number per page and given page', async () => {
      const { sut, listTransactionsStub } = makeSut()

      const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withQuery({ page: 3 })
        .build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(200)
      expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
        skipLimit: { limit: 15, skip: 30 }
      })
    })

    it('Should return a list with given items number per page and page 1', async () => {
      const { sut, listTransactionsStub } = makeSut()

      const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withQuery({ nItems: 20 })
        .build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(200)
      expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
        skipLimit: { limit: 20, skip: 0 }
      })
    })

    it('Should return a list with given items number per page and given page', async () => {
      const { sut, listTransactionsStub } = makeSut()

      const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withQuery({ nItems: 20, page: 3 })
        .build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(200)
      expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
        skipLimit: { limit: 20, skip: 40 }
      })
    })

    it('Should return a list with transactions registered by month', async () => {
      const { sut, listTransactionsStub } = makeSut()

      const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withQuery({ month: '202012' })
        .build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(200)
      expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
        month: '202012',
        skipLimit: { limit: 15, skip: 0 }
      })
    })
  })
})
