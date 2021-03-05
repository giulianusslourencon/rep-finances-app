import {
  InvalidAmountError,
  InvalidUserIdError
} from '@entities/atomics/errors'
import {
  TransactionPayersProps,
  TransactionPayers
} from '@entities/Transaction'
import {
  DuplicatedUserIdOnListError,
  EmptyListError
} from '@entities/Transaction/errors'

import { left } from '@shared/Either'

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
        AAAA: 30
      }
      const transactionPayersOrError = TransactionPayers.create(items)

      expect(transactionPayersOrError).toEqual(
        left(new InvalidUserIdError('AAAA'))
      )
    })

    it('Should not allow a list with invalid value', () => {
      const items: TransactionPayersProps = {
        P: 20,
        G: -2
      }
      const transactionPayersOrError = TransactionPayers.create(items)

      expect(transactionPayersOrError).toEqual(
        left(new InvalidAmountError('-2'))
      )
    })

    it('Should not allow an empty list', () => {
      const items: TransactionPayersProps = {}
      const transactionPayersOrError = TransactionPayers.create(items)

      expect(transactionPayersOrError).toEqual(left(new EmptyListError()))
    })

    it('Should not allow a list with duplicated user ids', () => {
      const items: TransactionPayersProps = {
        P: 20,
        p: 10
      }
      const transactionPayersOrError = TransactionPayers.create(items)

      expect(transactionPayersOrError).toEqual(
        left(new DuplicatedUserIdOnListError('P'))
      )
    })
  })
})
