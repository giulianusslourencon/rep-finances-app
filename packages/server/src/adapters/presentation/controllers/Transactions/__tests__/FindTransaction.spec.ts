import { HttpRequest } from '@presentation/contracts'
import { FindTransactionController } from '@presentation/controllers/Transactions'

import { TransactionProps } from '@entities/Transaction'

import { left, right } from '@shared/Either'

import { TransactionNotFoundError } from '@useCases/errors'
import {
  GetTransactionBalance,
  GetTransactionBalanceProps,
  GetTransactionBalanceResponse
} from '@useCases/ports/Balance'
import {
  FindTransaction,
  FindTransactionProps,
  FindTransactionResponse
} from '@useCases/ports/Transactions'

interface ISutType {
  sut: FindTransactionController
  findTransactionStub: FindTransaction
  getTransactionBalanceStub: GetTransactionBalance
}

const makeFindTransactionStub = (): FindTransaction => {
  class FindTransactionStub implements FindTransaction {
    async execute(
      props: FindTransactionProps
    ): Promise<FindTransactionResponse> {
      const foundTransaction: TransactionProps = {
        _id: 'id',
        amount: 30,
        items: {
          item: {
            related_users: ['P', 'G'],
            amount: 30
          }
        },
        month: '202012',
        payers: {
          P: 30
        },
        related: ['P', 'G'],
        date: new Date(21212121211),
        title: 'AAAAAAA'
      }
      return Promise.resolve(
        props.id === 'id'
          ? right(foundTransaction)
          : left(new TransactionNotFoundError(props.id))
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
  const sut = new FindTransactionController(
    findTransactionStub,
    getTransactionBalanceStub
  )
  return { sut, findTransactionStub, getTransactionBalanceStub }
}

describe('Find transaction controller', () => {
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
    expect(httpResponse.body.transaction._id).toBe('id')
  })

  it('Should return a 404 status code if the transaction was not found', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {},
      query: {},
      params: { id: 'id2' }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      name: 'TransactionNotFoundError',
      message: 'Transaction with id "id2" not found'
    })
  })

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
    expect(httpResponse.body).toEqual({
      name: 'ServerError',
      message: 'Server error: Unexpected error.'
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
    expect(httpResponse.body).toEqual({
      name: 'ServerError',
      message: 'Server error: Error.'
    })
  })

  it('Should return 500 if get transaction balance use case throws', async () => {
    const { sut, getTransactionBalanceStub } = makeSut()
    jest.spyOn(getTransactionBalanceStub, 'execute').mockImplementation(() => {
      throw new Error()
    })

    const httpRequest: HttpRequest = {
      query: {},
      body: {},
      params: { id: 'id' }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual({
      name: 'ServerError',
      message: 'Server error: Unexpected error.'
    })
  })

  it('Should return 500 if get transaction balance use case throws with custom reason', async () => {
    const { sut, getTransactionBalanceStub } = makeSut()
    jest.spyOn(getTransactionBalanceStub, 'execute').mockImplementation(() => {
      throw new Error('Error')
    })

    const httpRequest: HttpRequest = {
      query: {},
      body: {},
      params: { id: 'id' }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual({
      name: 'ServerError',
      message: 'Server error: Error.'
    })
  })
})
