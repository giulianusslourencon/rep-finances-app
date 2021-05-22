import { FindTransactionControllerOperation } from '@presentation/controllers/Finances/operations'
import { ErrorViewModel } from '@presentation/viewModels'
import { TransactionDetailsViewModel } from '@presentation/viewModels/Finances'

import { left, right } from '@shared/types'

import { HttpRequestBuilder } from '@tests/__helpers__/builders'
import { TransactionBuilder } from '@tests/__helpers__/builders/Finances'

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
  sut: FindTransactionControllerOperation
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
  const sut = new FindTransactionControllerOperation(
    findTransactionStub,
    getTransactionBalanceStub
  )

  return { sut, findTransactionStub, getTransactionBalanceStub }
}

describe('Find Transaction Controller', () => {
  describe('Success Cases', () => {
    it('Should return 200 with the transaction and its balance if found', async () => {
      const { sut } = makeSut()

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withParams({ id: 'id' })
        .build()

      const httpResponse = await sut.operate(httpRequest)

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

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withParams({ id: 'opa' })
        .build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(404)
      const responseBody = httpResponse.body as ErrorViewModel
      expect(responseBody.name).toBe('TransactionNotFoundError')
      expect(responseBody.errors[0].field).toBe('id')
    })
  })
})
