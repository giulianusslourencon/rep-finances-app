import { EntityErrorHandler } from '@entities/errors'
import { TransactionPayers, TransactionPayersProps } from '@entities/Finances'

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

    it('Should calculate the total paid by all users', () => {
      const payers: TransactionPayersProps = {
        P: 10,
        G: 50
      }

      const transactionPayers = new TransactionPayers(payers)

      expect(transactionPayers.totalPaid).toBe(60)
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
      expect(errorHandler.errors[0].field).toBe('AAAAA.userId')
      expect(errorHandler.errors[0].error.name).toBe('InvalidUserIdError')
    })

    it('Should not allow a list with invalid value', () => {
      const errorHandler = new EntityErrorHandler()
      const payers: TransactionPayersProps = {
        P: 20,
        G: -2
      }

      TransactionPayers.create(payers, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('G.amount')
      expect(errorHandler.errors[0].error.name).toBe('InvalidAmountError')
    })

    it('Should not allow an empty list', () => {
      const errorHandler = new EntityErrorHandler()
      const payers: TransactionPayersProps = {}

      TransactionPayers.create(payers, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('')
      expect(errorHandler.errors[0].error.name).toBe(
        'InvalidTransactionPayersError'
      )
    })

    it('Should not allow a list with duplicated user ids', () => {
      const errorHandler = new EntityErrorHandler()
      const payers: TransactionPayersProps = {
        P: 20,
        p: 10
      }

      TransactionPayers.create(payers, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('p')
      expect(errorHandler.errors[0].error.name).toBe(
        'InvalidTransactionPayersError'
      )
    })
  })
})
