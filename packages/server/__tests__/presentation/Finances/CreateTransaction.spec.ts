import { CreateTransactionControllerOperation } from '@presentation/controllers/Finances/operations'
import { ErrorViewModel } from '@presentation/viewModels'

import { left, right } from '@shared/types'

import { HttpRequestBuilder } from '@tests/__helpers__/builders'
import {
  TransactionBuilder,
  TransactionInitialPropsBuilder
} from '@tests/__helpers__/builders/Finances'

import {
  CreateTransaction,
  CreateTransactionProps,
  CreateTransactionResponse
} from '@useCases/Finances/ports/CreateTransaction'

interface ISutType {
  sut: CreateTransactionControllerOperation
  createTransactionStub: CreateTransaction
}

const makeCreateTransactionStub = (): CreateTransaction => {
  class CreateTransactionStub implements CreateTransaction {
    async execute(
      props: CreateTransactionProps
    ): Promise<CreateTransactionResponse> {
      return Promise.resolve(
        props.title === 'A'
          ? left([
              {
                field: 'title',
                error: {
                  name: 'InvalidNameError',
                  value: 'A',
                  reason: 'The name must contain between 2 and 64 characteres.'
                }
              }
            ])
          : right(TransactionBuilder.aTransaction().build())
      )
    }
  }

  return new CreateTransactionStub()
}

const makeSut = (): ISutType => {
  const createTransactionStub = makeCreateTransactionStub()
  const sut = new CreateTransactionControllerOperation(createTransactionStub)

  return { sut, createTransactionStub }
}

describe('Create transaction controller', () => {
  describe('Success Cases', () => {
    it('Should create a new transaction and return the created object with status code 201', async () => {
      const { sut } = makeSut()

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withBody(TransactionInitialPropsBuilder.aTransaction().build())
        .build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(201)
      expect(httpResponse.body).toHaveProperty('_id')
    })
  })

  describe('Error Cases', () => {
    it('Should return 406 and not create a new transaction if one or more fields are not valid', async () => {
      const { sut } = makeSut()

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withBody(
          TransactionInitialPropsBuilder.aTransaction()
            .withInvalidTitle()
            .build()
        )
        .build()

      const httpResponse = await sut.operate(httpRequest)

      expect(httpResponse.statusCode).toBe(406)
      const responseBody = httpResponse.body as ErrorViewModel
      expect(responseBody.name).toBe('InvalidFieldsError')
      expect(responseBody.errors[0].field).toBe('title')
    })
  })
})
