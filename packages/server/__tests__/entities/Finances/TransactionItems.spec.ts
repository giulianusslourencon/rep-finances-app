import { InvalidFields } from '@entities/errors'
import { TransactionItemsProps, TransactionItems } from '@entities/Finances'

describe('Transaction Items Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a list with valid items', () => {
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
      const transactionItemsOrError = TransactionItems.create(items)

      expect(transactionItemsOrError.isRight()).toBeTruthy()
      expect(
        (<TransactionItems>transactionItemsOrError.value).value
      ).toStrictEqual(items)
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a list with invalid item name', () => {
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
      const transactionItemsOrError = TransactionItems.create(items)

      expect(transactionItemsOrError.isLeft()).toBeTruthy()
      expect(transactionItemsOrError.value).toEqual<InvalidFields>([
        {
          field: 'i.name',
          error: {
            name: 'InvalidNameError',
            value: 'i',
            reason: 'The name must contain between 2 and 64 characteres.'
          }
        }
      ])
    })

    it('Should not allow a list with invalid amount', () => {
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
      const transactionItemsOrError = TransactionItems.create(items)

      expect(transactionItemsOrError.isLeft()).toBeTruthy()
      expect(transactionItemsOrError.value).toEqual<InvalidFields>([
        {
          field: 'item2.amount',
          error: {
            name: 'InvalidAmountError',
            value: '-20',
            reason: 'The amount must be a positive number.'
          }
        }
      ])
    })

    it('Should not allow a list with invalid related list', () => {
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
      const transactionItemsOrError = TransactionItems.create(items)

      expect(transactionItemsOrError.isLeft()).toBeTruthy()
      expect(transactionItemsOrError.value).toEqual<InvalidFields>([
        {
          field: 'item2.related_users',
          error: {
            name: 'InvalidRelatedListError',
            value: '',
            reason: 'There must be at least one item in the related list.'
          }
        }
      ])
    })

    it('Should not allow an empty list', () => {
      const items: TransactionItemsProps = {}
      const transactionItemsOrError = TransactionItems.create(items)

      expect(transactionItemsOrError.isLeft()).toBeTruthy()
      expect(transactionItemsOrError.value).toEqual<InvalidFields>([
        {
          error: {
            name: 'InvalidTransactionItemsError',
            value: '',
            reason: 'There must be at least one item in the transaction items.'
          }
        }
      ])
    })

    it('Should not allow a list with duplicated items names', () => {
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
      const transactionItemsOrError = TransactionItems.create(items)

      expect(transactionItemsOrError.isLeft()).toBeTruthy()
      expect(transactionItemsOrError.value).toEqual<InvalidFields>([
        {
          field: 'item1 ',
          error: {
            name: 'InvalidTransactionItemsError',
            value: 'item1',
            reason:
              'There cannot be two items in the transaction items with the same name.'
          }
        }
      ])
    })
  })
})
