import { InvalidFields } from '@entities/errors'
import { TransactionPayersProps, TransactionPayers } from '@entities/Finances'

describe('Transaction Payers Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a list with valid items', () => {
      const items: TransactionPayersProps = {
        P: 10,
        G: 50
      }
      const transactionPayersOrError = TransactionPayers.create(items)

      expect(transactionPayersOrError.isRight()).toBeTruthy()
      expect(
        (<TransactionPayers>transactionPayersOrError.value).value
      ).toStrictEqual(items)
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a list with invalid user id', () => {
      const items: TransactionPayersProps = {
        AAAAA: 30
      }
      const transactionPayersOrError = TransactionPayers.create(items)

      expect(transactionPayersOrError.isLeft()).toBeTruthy()
      expect(transactionPayersOrError.value).toEqual<InvalidFields>([
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
      const items: TransactionPayersProps = {
        P: 20,
        G: -2
      }
      const transactionPayersOrError = TransactionPayers.create(items)

      expect(transactionPayersOrError.isLeft()).toBeTruthy()
      expect(transactionPayersOrError.value).toEqual<InvalidFields>([
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
      const items: TransactionPayersProps = {}
      const transactionPayersOrError = TransactionPayers.create(items)

      expect(transactionPayersOrError.isLeft()).toBeTruthy()
      expect(transactionPayersOrError.value).toEqual<InvalidFields>([
        {
          error: {
            name: 'InvalidTransactionPayersError',
            value: '',
            reason: 'There must be at least one item in the transaction payers.'
          }
        }
      ])
    })

    it('Should not allow a list with duplicated user ids', () => {
      const items: TransactionPayersProps = {
        P: 20,
        p: 10
      }
      const transactionPayersOrError = TransactionPayers.create(items)

      expect(transactionPayersOrError.isLeft()).toBeTruthy()
      expect(transactionPayersOrError.value).toEqual<InvalidFields>([
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
