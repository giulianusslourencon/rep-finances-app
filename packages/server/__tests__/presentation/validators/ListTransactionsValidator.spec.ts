import { InvalidInputError } from '@presentation/controllers/errors'
import { ListTransactionsValidator } from '@presentation/controllers/Finances/validators'

import { right } from '@shared/types'

import { HttpRequestBuilder } from '@tests/builders'

describe('List Transactions Validator', () => {
  describe('Success Cases', () => {
    it('Should allow valid parameters', () => {
      const validator = new ListTransactionsValidator()

      const request = HttpRequestBuilder.anHttpRequest()
        .withQuery({
          month: '202106',
          page: 3,
          nItems: 20
        })
        .build()

      const response = validator.validate(request)

      expect(response.isRight()).toBeTruthy()
    })

    it('Should allow without the optional parameters', () => {
      const validator = new ListTransactionsValidator()

      const request = HttpRequestBuilder.anHttpRequest().build()

      const response = validator.validate(request)

      expect(response.isRight()).toBeTruthy()
    })

    it('Should format the parameters', () => {
      const validator = new ListTransactionsValidator()

      const request = HttpRequestBuilder.anHttpRequest()
        .withQuery({
          month: 202106,
          page: '3',
          nItems: '20  '
        })
        .build()

      const response = validator.validate(request)

      expect(response).toEqual(
        right({
          body: {},
          query: {
            month: '202106',
            page: 3,
            nItems: 20
          },
          params: {}
        })
      )
    })
  })

  describe('Error Cases', () => {
    describe('Page Query', () => {
      it('Should return a invalid input error if the "page" query is not a number', () => {
        const validator = new ListTransactionsValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withQuery({
            page: 'aa'
          })
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('page')
      })

      it('Should return a invalid input error if the "page" query is non-positive', () => {
        const validator = new ListTransactionsValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withQuery({
            page: -1
          })
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('page')
      })
    })

    describe('NItems Query', () => {
      it('Should return a invalid input error if the "nItems" query is not a number', () => {
        const validator = new ListTransactionsValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withQuery({
            nItems: 'aa'
          })
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('nItems')
      })

      it('Should return a invalid input error if the "nItems" query is non-positive', () => {
        const validator = new ListTransactionsValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withQuery({
            nItems: 0
          })
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('nItems')
      })
    })

    describe('Month Query', () => {
      it('Should return a invalid input error if the "month" query is not a number', () => {
        const validator = new ListTransactionsValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withQuery({
            month: '1A2B3C'
          })
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('month')
      })

      it('Should return a invalid input error if the "month" has less than 6 positions', () => {
        const validator = new ListTransactionsValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withQuery({
            month: '20210'
          })
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('month')
      })

      it('Should return a invalid input error if the "month" has more than 6 positions', () => {
        const validator = new ListTransactionsValidator()

        const request = HttpRequestBuilder.anHttpRequest()
          .withQuery({
            month: '2021060  '
          })
          .build()

        const response = validator.validate(request)

        expect(response.isLeft()).toBeTruthy()
        const error = response.value as InvalidInputError
        expect(error.name).toBe('InvalidInputError')
        expect(error.errors[0].field).toBe('month')
      })
    })
  })
})
