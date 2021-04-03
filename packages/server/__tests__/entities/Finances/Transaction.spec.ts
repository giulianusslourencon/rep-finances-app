import { InvalidFields } from '@entities/errors'
import { Transaction, TransactionInitProps } from '@entities/Finances'

describe('Transaction Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid transaction and fill readonly fields', () => {
      const transactionInit: TransactionInitProps = {
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
      const transactionOrError = Transaction.create(transactionInit, 'id')

      expect(transactionOrError.isRight()).toBeTruthy()

      const transaction = (<Transaction>transactionOrError.value).value

      expect(transaction).toHaveProperty('_id')
      expect(transaction.amount).toBe(20)
      expect(transaction.month).toBe('202012')
      expect(transaction.related).toStrictEqual(['P', 'F', 'G'])
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a transaction with invalid title', () => {
      const transactionInit: TransactionInitProps = {
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
      const transactionOrError = Transaction.create(transactionInit, 'id')

      expect(transactionOrError.isLeft()).toBeTruthy()
      expect(transactionOrError.value).toEqual<InvalidFields>([
        {
          field: 'title',
          error: {
            name: 'InvalidNameError',
            value: 'X',
            reason: 'The name must contain between 2 and 64 characteres.'
          }
        }
      ])
    })

    it('Should not allow a transaction with invalid timestamp', () => {
      const transactionInit: TransactionInitProps = {
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
      const transactionOrError = Transaction.create(transactionInit, 'id')

      expect(transactionOrError.isLeft()).toBeTruthy()
      expect(transactionOrError.value).toEqual<InvalidFields>([
        {
          field: 'date',
          error: {
            name: 'InvalidDateError',
            value: 'NaN',
            reason: 'The date may be poorly formatted.'
          }
        }
      ])
    })

    it('Should not allow a transaction with invalid items', () => {
      const transactionInit: TransactionInitProps = {
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
      const transactionOrError = Transaction.create(transactionInit, 'id')

      expect(transactionOrError.isLeft()).toBeTruthy()
      expect(transactionOrError.value).toEqual<InvalidFields>([
        {
          field: 'items.item1.related_users.__',
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
      const transactionInit: TransactionInitProps = {
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
      const transactionOrError = Transaction.create(transactionInit, 'id')

      expect(transactionOrError.isLeft()).toBeTruthy()
      expect(transactionOrError.value).toEqual<InvalidFields>([
        {
          field: 'payers.P.amount',
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
          }
        }
      ])
    })

    it('Should not allow a transaction with items value distinct from total paid', () => {
      const transactionInit: TransactionInitProps = {
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
      const transactionOrError = Transaction.create(transactionInit, 'id')

      expect(transactionOrError.isLeft()).toBeTruthy()
      expect(transactionOrError.value).toEqual<InvalidFields>([
        {
          error: {
            name: 'InvalidPaymentError',
            value: '',
            reason: 'Items values are distinct from total paid.'
          }
        }
      ])
    })
  })
})
