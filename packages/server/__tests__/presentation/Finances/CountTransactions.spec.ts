import { CountTransactionsControllerOperation } from '@presentation/controllers/Finances/operations'

import { HttpRequestBuilder } from '@tests/__helpers__/builders'

import {
  CountTransactions,
  CountTransactionsProps,
  CountTransactionsResponse
} from '@useCases/Finances/ports/CountTransactions'

interface ISutType {
  sut: CountTransactionsControllerOperation
  countTransactionsStub: CountTransactions
}

const makeCountTransactionsStub = (): CountTransactions => {
  class CountTransactionsStub implements CountTransactions {
    async execute(
      props: CountTransactionsProps
    ): Promise<CountTransactionsResponse> {
      return Promise.resolve(props.month ? 1 : 2)
    }
  }

  return new CountTransactionsStub()
}

const makeSut = (): ISutType => {
  const countTransactionsStub = makeCountTransactionsStub()
  const sut = new CountTransactionsControllerOperation(countTransactionsStub)
  return { sut, countTransactionsStub }
}

describe('Count Transactions Controller', () => {
  describe('Success Cases', () => {
    it('Should return 200 with the number of all registered transactions', async () => {
      const { sut, countTransactionsStub } = makeSut()

      const countTransactionsSpy = jest.spyOn(countTransactionsStub, 'execute')

      const httpRequest = HttpRequestBuilder.anHttpRequest().build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(200)
      expect(countTransactionsSpy).toBeCalledWith<[CountTransactionsProps]>({})
      expect(httpResponse.body).toEqual({ count: 2 })
    })

    it('Should return 200 with the number of all registered transactions by month', async () => {
      const { sut, countTransactionsStub } = makeSut()

      const countTransactionsSpy = jest.spyOn(countTransactionsStub, 'execute')

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withQuery({
          month: '202012'
        })
        .build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(200)
      expect(countTransactionsSpy).toBeCalledWith<[CountTransactionsProps]>({
        month: '202012'
      })
      expect(httpResponse.body).toEqual({ count: 1 })
    })
  })
})
