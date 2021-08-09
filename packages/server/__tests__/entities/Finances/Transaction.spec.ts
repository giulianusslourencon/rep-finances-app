import { TransactionBuilder } from '@tests/builders/Finances'

import { EntityErrorHandler } from '@entities/errors'
import { Transaction } from '@entities/Finances'

describe('Transaction Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid transaction and calculate info properties', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit =
        TransactionBuilder.aTransaction().buildInitialProps()

      const transaction = Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()

      const createdTransaction = transaction.value

      expect(createdTransaction.amount).toBe(10)
      expect(createdTransaction.month).toBe('202012')
      expect(createdTransaction.related).toStrictEqual(['P', 'D'])
    })

    it('Should extract the transaction final balance', () => {
      const transaction = TransactionBuilder.aTransaction().build()

      expect(transaction.extractBalance()).toStrictEqual({
        P: 5,
        D: -5
      })
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a transaction with invalid title', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionBuilder.aTransaction()
        .withInvalidTitle()
        .buildInitialProps()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('title')
      expect(errorHandler.errors[0].error.name).toBe('InvalidNameError')
    })

    it('Should not allow a transaction with invalid date', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionBuilder.aTransaction()
        .withInvalidDate()
        .buildInitialProps()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('date')
      expect(errorHandler.errors[0].error.name).toBe('InvalidDateError')
    })

    it('Should not allow a transaction with invalid items', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionBuilder.aTransaction()
        .withInvalidItems()
        .buildInitialProps()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('items.item.related_users.__')
      expect(errorHandler.errors[0].error.name).toBe('InvalidUserIdError')
    })

    it('Should not allow a transaction with invalid payers', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionBuilder.aTransaction()
        .withInvalidPayers()
        .buildInitialProps()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('payers.P.amount')
      expect(errorHandler.errors[0].error.name).toBe('InvalidAmountError')
    })

    it('Should not allow a transaction with items value distinct from total paid', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit = TransactionBuilder.aTransaction()
        .withInvalidPayment()
        .buildInitialProps()

      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('')
      expect(errorHandler.errors[0].error.name).toBe('InvalidPaymentError')
    })
  })
})
