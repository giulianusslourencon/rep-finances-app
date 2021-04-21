import { HttpRequest } from '@presentation/contracts'
import { ListTransactionsValidator } from '@presentation/controllers/Finances/validators'

import { left, right } from '@shared/types'

describe('List Transactions Validator', () => {
  describe('Success Cases', () => {
    it('Should allow valid parameters', () => {
      const validator = new ListTransactionsValidator()

      const request: HttpRequest = {
        body: {},
        query: {
          month: '202106',
          page: 3,
          nItems: 20
        },
        params: {}
      }

      const response = validator.validate(request)

      expect(response.isRight()).toBeTruthy()
    })

    it('Should allow without the optional parameters', () => {
      const validator = new ListTransactionsValidator()

      const request: HttpRequest = {
        body: {},
        query: {},
        params: {}
      }

      const response = validator.validate(request)

      expect(response.isRight()).toBeTruthy()
    })

    it('Should format the parameters', () => {
      const validator = new ListTransactionsValidator()

      const request: HttpRequest = {
        body: {},
        query: {
          month: 202106,
          page: '3',
          nItems: '20  '
        },
        params: {}
      }

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

        const request: HttpRequest = {
          body: {},
          query: {
            page: 'aa'
          },
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'page',
                message:
                  'Invalid input: page must be a `number` type, but the final value was: `NaN` (cast from the value `"aa"`).'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "page" query is non-positive', () => {
        const validator = new ListTransactionsValidator()

        const request: HttpRequest = {
          body: {},
          query: {
            page: -1
          },
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'page',
                message: 'Invalid input: page must be a positive number'
              }
            ]
          })
        )
      })
    })

    describe('NItems Query', () => {
      it('Should return a invalid input error if the "nItems" query is not a number', () => {
        const validator = new ListTransactionsValidator()

        const request: HttpRequest = {
          body: {},
          query: {
            nItems: 'aa'
          },
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'nItems',
                message:
                  'Invalid input: nItems must be a `number` type, but the final value was: `NaN` (cast from the value `"aa"`).'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "nItems" query is non-positive', () => {
        const validator = new ListTransactionsValidator()

        const request: HttpRequest = {
          body: {},
          query: {
            nItems: 0
          },
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'nItems',
                message: 'Invalid input: nItems must be a positive number'
              }
            ]
          })
        )
      })
    })

    describe('Month Query', () => {
      it('Should return a invalid input error if the "month" query is not a number', () => {
        const validator = new ListTransactionsValidator()

        const request: HttpRequest = {
          body: {},
          query: {
            month: '1A2B3C'
          },
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'month',
                message:
                  'Invalid input: month must be a number of exactly 6 positions'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "month" has less than 6 positions', () => {
        const validator = new ListTransactionsValidator()

        const request: HttpRequest = {
          body: {},
          query: {
            month: '20210'
          },
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'month',
                message:
                  'Invalid input: month must be a number of exactly 6 positions'
              }
            ]
          })
        )
      })

      it('Should return a invalid input error if the "month" has more than 6 positions', () => {
        const validator = new ListTransactionsValidator()

        const request: HttpRequest = {
          body: {},
          query: {
            month: '2021060  '
          },
          params: {}
        }

        const response = validator.validate(request)

        expect(response).toEqual(
          left({
            name: 'InvalidInputError',
            errors: [
              {
                field: 'month',
                message:
                  'Invalid input: month must be a number of exactly 6 positions'
              }
            ]
          })
        )
      })
    })
  })
})
