import { EntityErrorHandler } from '@entities/errors'
import { TransactionItems, TransactionItemsProps } from '@entities/Finances'

describe('Transaction Items Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a list with valid items', () => {
      const errorHandler = new EntityErrorHandler()
      const items: TransactionItemsProps = {
        item1: {
          amount: 10,
          related_users: ['P', 'G']
        },
        item2: {
          amount: 20,
          related_users: ['P']
        }
      }

      const transactionItems = TransactionItems.create(items, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(transactionItems.value).toStrictEqual(items)
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a list with invalid item name', () => {
      const errorHandler = new EntityErrorHandler()
      const items: TransactionItemsProps = {
        i: {
          amount: 10,
          related_users: ['P', 'G']
        },
        item2: {
          amount: 20,
          related_users: ['P']
        }
      }

      TransactionItems.create(items, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('i.name')
      expect(errorHandler.errors[0].error.name).toBe('InvalidNameError')
    })

    it('Should not allow a list with invalid amount', () => {
      const errorHandler = new EntityErrorHandler()
      const items: TransactionItemsProps = {
        item1: {
          amount: 10,
          related_users: ['P', 'G']
        },
        item2: {
          amount: -20,
          related_users: ['P']
        }
      }

      TransactionItems.create(items, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('item2.amount')
      expect(errorHandler.errors[0].error.name).toBe('InvalidAmountError')
    })

    it('Should not allow a list with invalid related list', () => {
      const errorHandler = new EntityErrorHandler()
      const items: TransactionItemsProps = {
        item1: {
          amount: 10,
          related_users: ['P', 'G']
        },
        item2: {
          amount: 20,
          related_users: []
        }
      }

      TransactionItems.create(items, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('item2.related_users')
      expect(errorHandler.errors[0].error.name).toBe('InvalidRelatedListError')
    })

    it('Should not allow an empty list', () => {
      const errorHandler = new EntityErrorHandler()
      const items: TransactionItemsProps = {}

      TransactionItems.create(items, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('')
      expect(errorHandler.errors[0].error.name).toBe(
        'InvalidTransactionItemsError'
      )
    })

    it('Should not allow a list with duplicated items names', () => {
      const errorHandler = new EntityErrorHandler()
      const items: TransactionItemsProps = {
        item1: {
          amount: 10,
          related_users: ['P', 'G']
        },
        'item1 ': {
          amount: 20,
          related_users: ['P']
        }
      }

      TransactionItems.create(items, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('item1 ')
      expect(errorHandler.errors[0].error.name).toBe(
        'InvalidTransactionItemsError'
      )
    })
  })
})
