import { HttpRequest } from '@presentation/contracts'
import { ListTransactionsController } from '@presentation/controllers/Finances/implementations'
import { ErrorViewModel } from '@presentation/viewModels'

import {
  ListTransactions,
  ListTransactionsProps,
  ListTransactionsResponse
} from '@useCases/Finances/ports/ListTransactions'

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

describe('List Transactions Controller', () => {
  describe('Success Cases', () => {
    it('Should return a list with default items number per page and page 1', async () => {
      const { sut, listTransactionsStub } = makeSut()
      const httpRequest: HttpRequest = {
        query: {},
        body: {},
        params: {}
      }
      const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
        skipLimit: { limit: 15, skip: 0 }
      })
    })

    it('Should return a list with default items number per page and given page', async () => {
      const { sut, listTransactionsStub } = makeSut()
      const httpRequest: HttpRequest = {
        query: { page: 3 },
        body: {},
        params: {}
      }
      const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
        skipLimit: { limit: 15, skip: 30 }
      })
    })

    it('Should return a list with given items number per page and page 1', async () => {
      const { sut, listTransactionsStub } = makeSut()
      const httpRequest: HttpRequest = {
        query: { nItems: 20 },
        body: {},
        params: {}
      }
      const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
        skipLimit: { limit: 20, skip: 0 }
      })
    })

    it('Should return a list with given items number per page and given page', async () => {
      const { sut, listTransactionsStub } = makeSut()
      const httpRequest: HttpRequest = {
        query: { nItems: 20, page: 3 },
        body: {},
        params: {}
      }
      const listTransactionsSpy = jest.spyOn(listTransactionsStub, 'execute')

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(listTransactionsSpy).toBeCalledWith<[ListTransactionsProps]>({
        skipLimit: { limit: 20, skip: 40 }
      })
    })

    it('Should return a list with transactions registered by month', async () => {
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
        month: '202012',
        skipLimit: { limit: 15, skip: 0 }
      })
    })
  })

  describe('Error Cases', () => {
    describe('Params Error Cases', () => {
      it('Should return 400 if page is not a number', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          query: { page: 'a' },
          body: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'MissingParamsError',
          errors: [
            {
              field: 'page',
              message:
                'Missing param: page must be a `number` type, but the final value was: `NaN` (cast from the value `"a"`).'
            }
          ]
        })
      })

      it('Should return 400 if nItems is not a number', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          query: { nItems: 'a' },
          body: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'MissingParamsError',
          errors: [
            {
              field: 'nItems',
              message:
                'Missing param: nItems must be a `number` type, but the final value was: `NaN` (cast from the value `"a"`).'
            }
          ]
        })
      })

      it('Should return 400 if page is non-positive', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          query: { page: 0 },
          body: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'MissingParamsError',
          errors: [
            {
              field: 'page',
              message: 'Missing param: page must be a positive number'
            }
          ]
        })
      })

      it('Should return 400 if nItems is non-positive', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          query: { nItems: -2 },
          body: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'MissingParamsError',
          errors: [
            {
              field: 'nItems',
              message: 'Missing param: nItems must be a positive number'
            }
          ]
        })
      })

      it('Should return 400 if month doesnt have length 6', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          query: { month: '1234' },
          body: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'MissingParamsError',
          errors: [
            {
              field: 'month',
              message: 'Missing param: month must be exactly 6 characters'
            }
          ]
        })
      })
    })
  })

  describe('Server Error Cases', () => {
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
