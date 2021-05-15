import { HttpRequest } from '@presentation/contracts'
import { CreateTransactionValidator } from '@presentation/controllers/Finances/validators'

import { left, right } from '@shared/types'

describe('Create Transaction Validator', () => {
  describe('Success Cases', () => {
    it('Should allow valid parameters', () => {
      const validator = new CreateTransactionValidator()

      const request: HttpRequest = {
        body: {
          items: {
            item: {
              related_users: ['P', 'D'],
              amount: 10
            }
          },
          payers: {
            P: 10
          },
          timestamp: 1608865200000,
          title: 'Vinho pra gay night de Natal'
        },
        query: {},
        params: {}
      }

      const response = validator.validate(request)

      expect(response.isRight()).toBeTruthy()
    })

    it('Should format the parameters', () => {
      const validator = new CreateTransactionValidator()

      const request: HttpRequest = {
        body: {
          items: {
            item: {
              related_users: ['P', 12],
              amount: '10'
            }
          },
          payers: {
            P: '10'
          },
          timestamp: '1608865200000',
          title: true
        },
        query: {},
        params: {}
      }

      const response = validator.validate(request)

      expect(response).toEqual(
        right({
          body: {
            items: {
              item: {
                related_users: ['P', '12'],
                amount: 10
              }
            },
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'true'
          },
          query: {},
          params: {}
        })
      )
    })
  })

  describe('Error Cases', () => {
    describe('Title Field', () => {
      it('Should return a invalid input error if the "title" field is missing', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            payers: {
              P: 10
            },
            timestamp: 1608865200000
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'title',
                message: 'Invalid input: title is a required field'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "title" field is not a string', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: {}
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'title',
                message:
                  'Invalid input: title must be a `string` type, but the final value was: `{}`.'
              }
            ]
          })
        )
      })
    })

    describe('Timestamp Field', () => {
      it('Should return a invalid input error if the "timestamp" field is missing', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            payers: {
              P: 10
            },
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'timestamp',
                message: 'Invalid input: timestamp is a required field'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "timestamp" field is not a number', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            payers: {
              P: 10
            },
            timestamp: false,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'timestamp',
                message:
                  'Invalid input: timestamp must be a `number` type, but the final value was: `NaN` (cast from the value `false`).'
              }
            ]
          })
        )
      })
    })

    describe('Items Field', () => {
      it('Should return a invalid input error if the "items" field is missing', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items',
                message: 'Invalid input: items is a required field'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "items" field is not an object (array)', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: [{ amount: 2, related_users: ['P'] }],
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items',
                message: 'Invalid input: items must be an `object` type'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "items" field is not an object (string)', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: 'items',
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items',
                message: 'Invalid input: items must be an `object` type'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "items" field is not an object (other)', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: false,
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items',
                message: 'Invalid input: items must be an `object` type'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "items" field is not an empty object', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {},
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items',
                message: 'Invalid input: items field must have at least 1 items'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if some item in the "items" field has the field "amount" missing', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D']
              }
            },
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items[0].amount',
                message: 'Invalid input: items[0].amount is a required field'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if some item in the "items" field has the field "amount" as not a number', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: false
              }
            },
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items[0].amount',
                message:
                  'Invalid input: items[0].amount must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`).'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if some item in the "items" field has the field "related_users" missing', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                amount: 10
              }
            },
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items[0].related_users',
                message:
                  'Invalid input: items[0].related_users is a required field'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if some item in the "items" field has the field "related_users" as not an array', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: 38,
                amount: 10
              }
            },
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items[0].related_users',
                message:
                  'Invalid input: items[0].related_users must be a `array` type'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if some item in the "items" field has the field "related_users" as an empty array', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: [],
                amount: 10
              }
            },
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items[0].related_users',
                message:
                  'Invalid input: items[0].related_users field must have at least 1 items'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if some item in the "items" field has the field "related_users" with a non string item', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: [[23]],
                amount: 10
              }
            },
            payers: {
              P: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'items[0].related_users[0]',
                message:
                  'Invalid input: items[0].related_users[0] must be a `string` type, but the final value was: `[23]`.'
              }
            ]
          })
        )
      })
    })

    describe('Payers Field', () => {
      it('Should return a invalid input error if the "payers" field is missing', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'payers',
                message: 'Invalid input: payers is a required field'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "payers" field is not an object (array)', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            payers: [10],
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'payers',
                message: 'Invalid input: payers must be an `object` type'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "payers" field is not an object (string)', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            payers: '10',
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'payers',
                message: 'Invalid input: payers must be an `object` type'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "payers" field is not an object (other)', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            payers: 10,
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'payers',
                message: 'Invalid input: payers must be an `object` type'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "payers" field is an empty object', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            payers: {},
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'payers',
                message:
                  'Invalid input: payers field must have at least 1 items'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if some item in the "payers" field is not a number', () => {
        const validator = new CreateTransactionValidator()

        const request: HttpRequest = {
          body: {
            items: {
              item: {
                related_users: ['P', 'D'],
                amount: 10
              }
            },
            payers: {
              P: true,
              D: 10
            },
            timestamp: 1608865200000,
            title: 'Vinho pra gay night de Natal'
          },
          query: {},
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'payers[0]',
                message:
                  'Invalid input: payers[0] must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`).'
              }
            ]
          })
        )
      })
    })
  })
})
