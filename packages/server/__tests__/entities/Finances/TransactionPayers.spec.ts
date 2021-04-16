import { EntityErrorHandler, InvalidFields } from '@entities/errors'
import { TransactionPayersProps, TransactionPayers } from '@entities/Finances'

describe('Transaction Payers Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a list with valid items', () => {
      const errorHandler = new EntityErrorHandler()
      const payers: TransactionPayersProps = {
        P: 10,
        G: 50
      }
      const transactionPayers = TransactionPayers.create(payers, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(transactionPayers.value).toStrictEqual(payers)
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a list with invalid user id', () => {
      const errorHandler = new EntityErrorHandler()
      const payers: TransactionPayersProps = {
        AAAAA: 30
      }
      TransactionPayers.create(payers, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: 'AAAAA.userId',
          error: {
            name: 'InvalidUserIdError',
            value: 'AAAAA',
            reason: 'The user id must contain between 1 and 2 characteres.'
          }
        }
      ])
    })

    it('Should not allow a list with invalid value', () => {
      const errorHandler = new EntityErrorHandler()
      const payers: TransactionPayersProps = {
        P: 20,
        G: -2
      }
      TransactionPayers.create(payers, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: 'G.amount',
          error: {
            name: 'InvalidAmountError',
            value: '-2',
            reason: 'The amount must be a positive number.'
          }
        }
      ])
    })

    it('Should not allow an empty list', () => {
      const errorHandler = new EntityErrorHandler()
      const payers: TransactionPayersProps = {}
      TransactionPayers.create(payers, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          error: {
            name: 'InvalidTransactionPayersError',
            value: '',
            reason: 'There must be at least one item in the transaction payers.'
          },
          field: ''
        }
      ])
    })

    it('Should not allow a list with duplicated user ids', () => {
      const errorHandler = new EntityErrorHandler()
      const payers: TransactionPayersProps = {
        P: 20,
        p: 10
      }
      TransactionPayers.create(payers, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: 'p',
          error: {
            name: 'InvalidTransactionPayersError',
            value: 'P',
            reason:
              'There cannot be two items in the transaction payers with the same id.'
          }
        }
      ])
    })
  })
})
