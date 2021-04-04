import { Controller, HttpRequest } from '@presentation/contracts'
import { CountTransactionsControllerOperation } from '@presentation/controllers/Finances/operations'
import { ErrorViewModel } from '@presentation/viewModels'

import {
  CountTransactions,
  CountTransactionsProps,
  CountTransactionsResponse
} from '@useCases/Finances/ports/CountTransactions'

interface ISutType {
  sut: Controller
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
  const sut = new Controller(
    new CountTransactionsControllerOperation(countTransactionsStub)
  )
  return { sut, countTransactionsStub }
}

describe('Count Transactions Controller', () => {
  describe('Success Cases', () => {
    it('Should return the number of all registered transactions', async () => {
      const { sut, countTransactionsStub } = makeSut()
      const httpRequest: HttpRequest = {
        query: {},
        body: {},
        params: {}
      }
      const countTransactionsSpy = jest.spyOn(countTransactionsStub, 'execute')

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(countTransactionsSpy).toBeCalledWith<[CountTransactionsProps]>({})
      expect(httpResponse.body).toEqual({ count: 2 })
    })

    it('Should return the number of all registered transactions by month', async () => {
      const { sut, countTransactionsStub } = makeSut()
      const httpRequest: HttpRequest = {
        query: { month: '202012' },
        body: {},
        params: {}
      }
      const countTransactionsSpy = jest.spyOn(countTransactionsStub, 'execute')

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(countTransactionsSpy).toBeCalledWith<[CountTransactionsProps]>({
        month: '202012'
      })
      expect(httpResponse.body).toEqual({ count: 1 })
    })
  })

  describe('Server Error Cases', () => {
    it('Should return 500 if use case throws', async () => {
      const { sut, countTransactionsStub } = makeSut()
      jest.spyOn(countTransactionsStub, 'execute').mockImplementation(() => {
        throw new Error()
      })

      const httpRequest: HttpRequest = {
        query: {},
        body: {},
        params: {}
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual<ErrorViewModel>({
        name: 'ServerError',
        errors: [
          {
            message: 'Server error: Unexpected error.'
          }
        ]
      })
    })

    it('Should return 500 if use case throws with custom reason', async () => {
      const { sut, countTransactionsStub } = makeSut()
      jest.spyOn(countTransactionsStub, 'execute').mockImplementation(() => {
        throw new Error('Error')
      })

      const httpRequest: HttpRequest = {
        query: {},
        body: {},
        params: {}
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual<ErrorViewModel>({
        name: 'ServerError',
        errors: [
          {
            message: 'Server error: Error.'
          }
        ]
      })
    })
  })
})
