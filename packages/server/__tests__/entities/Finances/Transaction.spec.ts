import { TransactionInitialPropsBuilder } from '@tests/builders/Finances'

import { EntityErrorHandler } from '@entities/errors'
import { Transaction } from '@entities/Finances'

describe('Transaction Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid transaction and fill readonly fields', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionInitialPropsBuilder.aTransaction().buildWithId()

      const transaction = Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()

      expect(transaction.value).toHaveProperty('_id')
      expect(transaction.value.amount).toBe(10)
      expect(transaction.value.month).toBe('202012')
      expect(transaction.value.related).toStrictEqual(['P', 'D'])
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a transaction with invalid title', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionInitialPropsBuilder.aTransaction()
        .withInvalidTitle()
        .buildWithId()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('title')
      expect(errorHandler.errors[0].error.name).toBe('InvalidNameError')
    })

    it('Should not allow a transaction with invalid timestamp', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionInitialPropsBuilder.aTransaction()
        .withInvalidTimestamp()
        .buildWithId()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('timestamp')
      expect(errorHandler.errors[0].error.name).toBe('InvalidDateError')
    })

    it('Should not allow a transaction with invalid items', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionInitialPropsBuilder.aTransaction()
        .withInvalidItems()
        .buildWithId()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('items.item.related_users.__')
      expect(errorHandler.errors[0].error.name).toBe('InvalidUserIdError')
    })

    it('Should not allow a transaction with invalid payers', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionInitialPropsBuilder.aTransaction()
        .withInvalidPayers()
        .buildWithId()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('payers.P.amount')
      expect(errorHandler.errors[0].error.name).toBe('InvalidAmountError')
    })

    it('Should not allow a transaction with items value distinct from total paid', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionInitialPropsBuilder.aTransaction()
        .withInvalidPayment()
        .buildWithId()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('')
      expect(errorHandler.errors[0].error.name).toBe('InvalidPaymentError')
    })
  })
})
