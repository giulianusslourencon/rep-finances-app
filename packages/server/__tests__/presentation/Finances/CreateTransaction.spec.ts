import { Controller, HttpRequest } from '@presentation/contracts'
import { CreateTransactionControllerOperation } from '@presentation/controllers/Finances/operations'
import { ErrorViewModel } from '@presentation/viewModels'

import { left, right } from '@shared/types'

import {
  TransactionBuilder,
  TransactionInitialPropsBuilder
} from '@tests/builders'

import {
  CreateTransaction,
  CreateTransactionProps,
  CreateTransactionResponse
} from '@useCases/Finances/ports/CreateTransaction'

interface ISutType {
  sut: Controller
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
  const sut = new Controller(
    new CreateTransactionControllerOperation(createTransactionStub)
  )
  return { sut, createTransactionStub }
}

describe('Create transaction controller', () => {
  describe('Success Cases', () => {
    it('Should create a new transaction and return the created object with status code 201', async () => {
      const { sut } = makeSut()
      const httpRequest: HttpRequest = {
        body: TransactionInitialPropsBuilder.aTransaction().build(),
        query: {},
        params: {}
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(201)
      expect(httpResponse.body).toHaveProperty('_id')
    })
  })

  describe('Error Cases', () => {
    it('Should not create a new transaction if one or more fields are not valid', async () => {
      const { sut } = makeSut()
      const httpRequest: HttpRequest = {
        body: TransactionInitialPropsBuilder.aTransaction()
          .withInvalidTitle()
          .build(),
        query: {},
        params: {}
      }

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(406)
      expect(httpResponse.body).toEqual<ErrorViewModel>({
        name: 'InvalidFieldsError',
        errors: [
          {
            field: 'title',
            message: 'The name must contain between 2 and 64 characteres.'
          }
        ]
      })
    })

    describe('Params Error Cases', () => {
      it('Should not create a new transaction if title is missing', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          body: {
            timestamp: 21212121211,
            items: {
              item: {
                related_users: ['P', 'G'],
                amount: 30
              }
            },
            payers: {
              P: 30
            }
          },
          query: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'InvalidInputError',
          errors: [
            {
              field: 'title',
              message: 'Invalid input: title is a required field'
            }
          ]
        })
      })

      it('Should not create a new transaction if timestamp is missing', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          body: {
            title: 'AAAAAAA',
            items: {
              item: {
                related_users: ['P', 'G'],
                amount: 30
              }
            },
            payers: {
              P: 30
            }
          },
          query: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'InvalidInputError',
          errors: [
            {
              field: 'timestamp',
              message: 'Invalid input: timestamp is a required field'
            }
          ]
        })
      })

      it('Should not create a new transaction if timestamp is not a number', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          body: {
            title: 'AAAAAAA',
            timestamp: 'abacate',
            items: {
              item: {
                related_users: ['P', 'G'],
                amount: 30
              }
            },
            payers: {
              P: 30
            }
          },
          query: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'InvalidInputError',
          errors: [
            {
              field: 'timestamp',
              message:
                'Invalid input: timestamp must be a `number` type, but the final value was: `NaN` (cast from the value `"abacate"`).'
            }
          ]
        })
      })

      it('Should not create a new transaction if items is missing', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          body: {
            title: 'AAAAAAA',
            timestamp: 21211212122,
            payers: {
              P: 30
            }
          },
          query: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'InvalidInputError',
          errors: [
            {
              field: 'items',
              message: 'Invalid input: items is a required field'
            }
          ]
        })
      })

      it('Should not create a new transaction if payers is missing', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
          body: {
            title: 'AAAAAAA',
            timestamp: 21211212122,
            items: {
              item: {
                related_users: ['P', 'G'],
                amount: 30
              }
            }
          },
          query: {},
          params: {}
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual<ErrorViewModel>({
          name: 'InvalidInputError',
          errors: [
            {
              field: 'payers',
              message: 'Invalid input: payers is a required field'
            }
          ]
        })
      })
    })
  })

  describe('Server Error Cases', () => {
    it('Should return 500 if use case throws', async () => {
      const { sut, createTransactionStub } = makeSut()
      jest.spyOn(createTransactionStub, 'execute').mockImplementation(() => {
        throw new Error()
      })

      const httpRequest: HttpRequest = {
        body: {
          timestamp: 21212121211,
          title: 'AAAAAAA',
          items: {
            item: {
              related_users: ['P', 'G'],
              amount: 30
            }
          },
          payers: {
            P: 30
          }
        },
        query: {},
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
      const { sut, createTransactionStub } = makeSut()
      jest.spyOn(createTransactionStub, 'execute').mockImplementation(() => {
        throw new Error('Error')
      })

      const httpRequest: HttpRequest = {
        body: {
          timestamp: 21212121211,
          title: 'AAAAAAA',
          items: {
            item: {
              related_users: ['P', 'G'],
              amount: 30
            }
          },
          payers: {
            P: 30
          }
        },
        query: {},
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
