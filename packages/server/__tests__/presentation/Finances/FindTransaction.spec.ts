import { Controller, HttpRequest } from '@presentation/contracts'
import { FindTransactionControllerOperation } from '@presentation/controllers/Finances/operations'
import { ErrorViewModel } from '@presentation/viewModels'
import { TransactionDetailsViewModel } from '@presentation/viewModels/Finances'

import { left, right } from '@shared/types'

import { TransactionBuilder } from '@tests/builders/Finances'

import { TransactionProps } from '@entities/Finances'

import {
  FindTransaction,
  FindTransactionProps,
  FindTransactionResponse
} from '@useCases/Finances/ports/FindTransaction'
import {
  GetTransactionBalance,
  GetTransactionBalanceProps,
  GetTransactionBalanceResponse
} from '@useCases/Finances/ports/GetTransactionBalance'

interface ISutType {
  sut: Controller
  findTransactionStub: FindTransaction
  getTransactionBalanceStub: GetTransactionBalance
}

const makeFindTransactionStub = (): FindTransaction => {
  class FindTransactionStub implements FindTransaction {
    async execute(
      props: FindTransactionProps
    ): Promise<FindTransactionResponse> {
      const foundTransaction: TransactionProps = TransactionBuilder.aTransaction().build()
      return Promise.resolve(
        props.id === 'id'
          ? right(foundTransaction)
          : left({
              name: 'TransactionNotFoundError',
              key: 'id',
              value: 'opa',
              message: 'There is no transaction registered with id "opa"'
            })
      )
    }
  }

  return new FindTransactionStub()
}

const makeGetTransactionBalanceStub = (): GetTransactionBalance => {
  class GetTransactionBalanceStub implements GetTransactionBalance {
    execute(
      _props: GetTransactionBalanceProps
    ): Promise<GetTransactionBalanceResponse> {
      return Promise.resolve(
        right({
          individual_balance: {
            P: 15,
            G: -15
          }
        })
      )
    }
  }

  return new GetTransactionBalanceStub()
}

const makeSut = (): ISutType => {
  const findTransactionStub = makeFindTransactionStub()
  const getTransactionBalanceStub = makeGetTransactionBalanceStub()
  const sut = new Controller(
    new FindTransactionControllerOperation(
      findTransactionStub,
      getTransactionBalanceStub
    )
  )
  return { sut, findTransactionStub, getTransactionBalanceStub }
}

describe('Find Transaction Controller', () => {
  describe('Success Cases', () => {
    it('Should return the transaction and its balance if found', async () => {
      const { sut } = makeSut()
      const httpRequest: HttpRequest = {
        body: {},
        query: {},
        params: { id: 'id' }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body).toHaveProperty('transaction')
      expect(httpResponse.body).toHaveProperty('balance')
      expect(
        (<TransactionDetailsViewModel>httpResponse.body).transaction._id
      ).toBe('id')
    })
  })

  describe('Error Cases', () => {
    it('Should return a 404 status code if the transaction was not found', async () => {
      const { sut } = makeSut()
      const httpRequest: HttpRequest = {
        body: {},
        query: {},
        params: { id: 'opa' }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(404)
      expect(httpResponse.body).toEqual<ErrorViewModel>({
        name: 'TransactionNotFoundError',
        errors: [
          {
            field: 'id',
            message: 'There is no transaction registered with id "opa"'
          }
        ]
      })
    })
  })

  describe('Server Error Cases', () => {
    it('Should return 500 if find transaction use case throws', async () => {
      const { sut, findTransactionStub } = makeSut()
      jest.spyOn(findTransactionStub, 'execute').mockImplementation(() => {
        throw new Error()
      })

      const httpRequest: HttpRequest = {
        query: {},
        body: {},
        params: { id: 'id' }
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

    it('Should return 500 if find transaction use case throws with custom reason', async () => {
      const { sut, findTransactionStub } = makeSut()
      jest.spyOn(findTransactionStub, 'execute').mockImplementation(() => {
        throw new Error('Error')
      })

      const httpRequest: HttpRequest = {
        query: {},
        body: {},
        params: { id: 'id' }
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

    it('Should return 500 if get transaction balance use case throws', async () => {
      const { sut, getTransactionBalanceStub } = makeSut()
      jest
        .spyOn(getTransactionBalanceStub, 'execute')
        .mockImplementation(() => {
          throw new Error()
        })

      const httpRequest: HttpRequest = {
        query: {},
        body: {},
        params: { id: 'id' }
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

    it('Should return 500 if get transaction balance use case throws with custom reason', async () => {
      const { sut, getTransactionBalanceStub } = makeSut()
      jest
        .spyOn(getTransactionBalanceStub, 'execute')
        .mockImplementation(() => {
          throw new Error('Error')
        })

      const httpRequest: HttpRequest = {
        query: {},
        body: {},
        params: { id: 'id' }
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
