import { InvalidAmountError } from '@entities/atomics/errors/InvalidAmount'
import { InvalidTitleError } from '@entities/atomics/errors/InvalidTitle'

import { TransactionItemsProps } from '@shared/@types/Transaction'
import { left } from '@shared/Either'

import { EmptyListError } from '../errors/EmptyList'
import { TransactionItems } from '../TransactionItems'

describe('Transaction items', () => {
  it('Should allow a list with valid items', () => {
    const items: TransactionItemsProps = {
      item1: {
        value: 10,
        related_users: ['P', 'G']
      },
      item2: {
        value: 20,
        related_users: ['P']
      }
    }
    const transactionItemsOrError = TransactionItems.create(items)

    expect(transactionItemsOrError.isRight()).toBeTruthy()
    expect(
      (<TransactionItems>transactionItemsOrError.value).value
    ).toStrictEqual(items)
  })

  it('Should not allow a list with invalid title', () => {
    const items: TransactionItemsProps = {
      i: {
        value: 10,
        related_users: ['P', 'G']
      },
      item2: {
        value: 20,
        related_users: ['P']
      }
    }
    const transactionItemsOrError = TransactionItems.create(items)

    expect(transactionItemsOrError).toEqual(left(new InvalidTitleError('i')))
  })

  it('Should not allow a list with invalid value', () => {
    const items: TransactionItemsProps = {
      item1: {
        value: 10,
        related_users: ['P', 'G']
      },
      item2: {
        value: -20,
        related_users: ['P']
      }
    }
    const transactionItemsOrError = TransactionItems.create(items)

    expect(transactionItemsOrError).toEqual(left(new InvalidAmountError('-20')))
  })

  it('Should not allow a list with invalid related list', () => {
    const items: TransactionItemsProps = {
      item1: {
        value: 10,
        related_users: ['P', 'G']
      },
      item2: {
        value: 20,
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
})
