import { InvalidInputError } from '@presentation/controllers/errors'
import { CreateTransactionValidator } from '@presentation/controllers/Finances/validators'

import { right } from '@shared/types'

import { HttpRequestBuilder } from '@tests/__helpers__/builders'
import { CreateTransactionVMBuilder } from '@tests/__helpers__/builders/Finances/viewModels'

describe('Create Transaction Validator', () => {
  describe('Success Cases', () => {
    it('Should allow valid parameters', () => {
      const validator = new CreateTransactionValidator()

      const request = HttpRequestBuilder.anHttpRequest()
        .withBody(CreateTransactionVMBuilder.aTransaction().build())
        .build()

      const response = validator.validate(request)

      expect(response.isRight()).toBeTruthy()
    })

    it('Should format the parameters', () => {
      const validator = new CreateTransactionValidator()

      const request = HttpRequestBuilder.anHttpRequest()
        .withBody({
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
        })
        .build()

      const response = validator.validate(request)

      expect(response).toEqual(
        right(
          HttpRequestBuilder.anHttpRequest()
            .withBody({
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
            })
            .build()
        )
      )
    })
  })

  describe('Error Cases', () => {
    describe('Title Field', () => {
      it('Should return a invalid input error if the "title" field is missing', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction().withoutTitle().build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('title')
      })

      it('Should return a invalid input error if the "title" field is not a string', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withTitleAsNotAString()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('title')
      })
    })

    describe('Timestamp Field', () => {
      it('Should return a invalid input error if the "timestamp" field is missing', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction().withoutTimestamp().build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('timestamp')
      })

      it('Should return a invalid input error if the "timestamp" field is not a number', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withTimestampAsNotANumber()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('timestamp')
      })
    })

    describe('Items Field', () => {
      it('Should return a invalid input error if the "items" field is missing', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction().withoutItems().build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items')
      })

      it('Should return a invalid input error if the "items" field is not an object (array)', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withItemsAsAnArray()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items')
      })

      it('Should return a invalid input error if the "items" field is not an object (string)', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withItemsAsAString()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items')
      })

      it('Should return a invalid input error if the "items" field is not an object (other)', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withItemsAsNotAnObject()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items')
      })

      it('Should return a invalid input error if the "items" field is an empty object', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withItemsAsAnEmptyObject()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items')
      })

      it('Should return a invalid input error if some item in the "items" field has the field "amount" missing', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withoutItemsAmount()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items[0].amount')
      })

      it('Should return a invalid input error if some item in the "items" field has the field "amount" as not a number', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withItemsAmountAsNotANumber()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items[0].amount')
      })

      it('Should return a invalid input error if some item in the "items" field has the field "related_users" missing', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withoutItemsRelatedUsers()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items[0].related_users')
      })

      it('Should return a invalid input error if some item in the "items" field has the field "related_users" as not an array', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withItemsRelatedUsersAsNotAnArray()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items[0].related_users')
      })

      it('Should return a invalid input error if some item in the "items" field has the field "related_users" as an empty array', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withItemsRelatedUsersAsAnEmptyArray()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items[0].related_users')
      })

      it('Should return a invalid input error if some item in the "items" field has the field "related_users" with a non string item', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withItemsRelatedUsersItemAsNotAString()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('items[0].related_users[0]')
      })
    })

    describe('Payers Field', () => {
      it('Should return a invalid input error if the "payers" field is missing', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction().withoutPayers().build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('payers')
      })

      it('Should return a invalid input error if the "payers" field is not an object (array)', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withPayersAsAnArray()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('payers')
      })

      it('Should return a invalid input error if the "payers" field is not an object (string)', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withPayersAsAString()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('payers')
      })

      it('Should return a invalid input error if the "payers" field is not an object (other)', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withPayersAsNotAnObject()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('payers')
      })

      it('Should return a invalid input error if the "payers" field is an empty object', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withPayersAsAnEmptyObject()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('payers')
      })

      it('Should return a invalid input error if some item in the "payers" field is not a number', () => {
        const validator = new CreateTransactionValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withBody(
            CreateTransactionVMBuilder.aTransaction()
              .withPayersItemAsNotANumber()
              .build()
          )
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('payers[1]')
      })
    })
  })
})
