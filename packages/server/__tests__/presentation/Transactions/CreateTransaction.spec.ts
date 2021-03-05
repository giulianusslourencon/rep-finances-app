import { HttpRequest } from '@presentation/contracts'
import { CreateTransactionController } from '@presentation/controllers/Transactions'

import { InvalidLabelError } from '@entities/atomics/errors'

import { left, right } from '@shared/Either'

import {
  CreateTransaction,
  CreateTransactionProps,
  CreateTransactionResponse
} from '@useCases/Transactions/ports/CreateTransaction'

interface ISutType {
  sut: CreateTransactionController
  createTransactionStub: CreateTransaction
}

const makeCreateTransactionStub = (): CreateTransaction => {
  class CreateTransactionStub implements CreateTransaction {
    async execute(
      props: CreateTransactionProps
    ): Promise<CreateTransactionResponse> {
      return Promise.resolve(
        props.title === 'A'
          ? left(new InvalidLabelError('A'))
          : right({
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
            })
      )
    }
  }

  return new CreateTransactionStub()
}

const makeSut = (): ISutType => {
  const createTransactionStub = makeCreateTransactionStub()
  const sut = new CreateTransactionController(createTransactionStub)
  return { sut, createTransactionStub }
}

describe('Create transaction controller', () => {
  it('Should create a new transaction and return the created object with status code 201', async () => {
    const { sut } = makeSut()
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
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toHaveProperty('_id')
  })

  it('Should not create a new transaction if one or more fields are not valid', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        timestamp: 21212121211,
        title: 'A',
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
    expect(httpResponse.body).toEqual({
      name: 'InvalidLabelError',
      message: 'The label "A" is invalid.'
    })
  })

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
    expect(httpResponse.statusCode).toBe(406)
    expect(httpResponse.body).toEqual({
      name: 'MissingParamError',
      message: 'Missing param: title is a required field'
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
    expect(httpResponse.statusCode).toBe(406)
    expect(httpResponse.body).toEqual({
      name: 'MissingParamError',
      message: 'Missing param: timestamp is a required field'
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
    expect(httpResponse.statusCode).toBe(406)
    expect(httpResponse.body).toEqual({
      name: 'MissingParamError',
      message:
        'Missing param: timestamp must be a `number` type, but the final value was: `NaN` (cast from the value `"abacate"`).'
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
    expect(httpResponse.statusCode).toBe(406)
    expect(httpResponse.body).toEqual({
      name: 'MissingParamError',
      message: 'Missing param: items is a required field'
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
    expect(httpResponse.statusCode).toBe(406)
    expect(httpResponse.body).toEqual({
      name: 'MissingParamError',
      message: 'Missing param: payers is a required field'
    })
  })

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
    expect(httpResponse.body).toEqual({
      name: 'ServerError',
      message: 'Server error: Unexpected error.'
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
    expect(httpResponse.body).toEqual({
      name: 'ServerError',
      message: 'Server error: Error.'
    })
  })
})
