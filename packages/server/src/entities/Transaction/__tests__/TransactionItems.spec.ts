import { InvalidAmountError, InvalidLabelError } from '@entities/atomics/errors'
import { TransactionItemsProps, TransactionItems } from '@entities/Transaction'
import {
  DuplicatedItemNameOnTransactionError,
  EmptyListError
} from '@entities/Transaction/errors'

import { left } from '@shared/Either'

describe('Transaction items', () => {
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

    expect(transactionItemsOrError).toEqual(left(new InvalidLabelError('i')))
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

    expect(transactionItemsOrError).toEqual(left(new InvalidAmountError('-20')))
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

    expect(transactionItemsOrError).toEqual(left(new EmptyListError()))
  })

  it('Should not allow an empty list', () => {
    const items: TransactionItemsProps = {}
    const transactionItemsOrError = TransactionItems.create(items)

    expect(transactionItemsOrError).toEqual(left(new EmptyListError()))
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

    expect(transactionItemsOrError).toEqual(
      left(new DuplicatedItemNameOnTransactionError('item1'))
    )
  })
})
