import { EntityErrorHandler, InvalidFields } from '@entities/errors'
import { Transaction, TransactionInitProps } from '@entities/Finances'

describe('Transaction Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid transaction and fill readonly fields', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit: TransactionInitProps = {
        id: 'id',
        title: 'Compra X',
        timestamp: 1608336000000,
        items: {
          item1: {
            amount: 20,
            related_users: ['F', 'G']
          }
        },
        payers: {
          P: 20
        }
      }
      const transaction = Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()

      expect(transaction.value).toHaveProperty('_id')
      expect(transaction.value.amount).toBe(20)
      expect(transaction.value.month).toBe('202012')
      expect(transaction.value.related).toStrictEqual(['P', 'F', 'G'])
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a transaction with invalid title', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit: TransactionInitProps = {
        id: 'id',
        title: 'X',
        timestamp: 1608336000000,
        items: {
          item1: {
            amount: 20,
            related_users: ['F', 'G']
          }
        },
        payers: {
          P: 20
        }
      }
      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: '.title',
          error: {
            name: 'InvalidNameError',
            value: 'X',
            reason: 'The name must contain between 2 and 64 characteres.'
          }
        }
      ])
    })

    it('Should not allow a transaction with invalid timestamp', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit: TransactionInitProps = {
        id: 'id',
        title: 'Compra X',
        timestamp: NaN,
        items: {
          item1: {
            amount: 20,
            related_users: ['F', 'G']
          }
        },
        payers: {
          P: 20
        }
      }
      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: '.timestamp',
          error: {
            name: 'InvalidDateError',
            value: 'NaN',
            reason: 'The date may be poorly formatted.'
          }
        }
      ])
    })

    it('Should not allow a transaction with invalid items', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit: TransactionInitProps = {
        id: 'id',
        title: 'Compra X',
        timestamp: 1608336000000,
        items: {
          item1: {
            amount: 20,
            related_users: ['F', '__']
          }
        },
        payers: {
          P: 20
        }
      }
      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: '.items.item1.related_users.__',
          error: {
            name: 'InvalidUserIdError',
            value: '__',
            reason:
              'The id cannot contain special characters, nor can it contain a number in the first position.'
          }
        }
      ])
    })

    it('Should not allow a transaction with invalid payers', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit: TransactionInitProps = {
        id: 'id',
        title: 'Compra X',
        timestamp: 1608336000000,
        items: {
          item1: {
            amount: 20,
            related_users: ['F', 'G']
          }
        },
        payers: {
          P: -20
        }
      }
      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: '.payers.P.amount',
          error: {
            name: 'InvalidAmountError',
            value: '-20',
            reason: 'The amount must be a positive number.'
          }
        },
        {
          error: {
            name: 'InvalidPaymentError',
            value: '',
            reason: 'Items values are distinct from total paid.'
          },
          field: ''
        }
      ])
    })

    it('Should not allow a transaction with items value distinct from total paid', () => {
      const errorHandler = new EntityErrorHandler()
      const transactionInit: TransactionInitProps = {
        id: 'id',
        title: 'Compra X',
        timestamp: 1608336000000,
        items: {
          item1: {
            amount: 20,
            related_users: ['F', 'G']
          }
        },
        payers: {
          P: 30
        }
      }
      Transaction.create(transactionInit, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          error: {
            name: 'InvalidPaymentError',
            value: '',
            reason: 'Items values are distinct from total paid.'
          },
          field: ''
        }
      ])
    })
  })
})
