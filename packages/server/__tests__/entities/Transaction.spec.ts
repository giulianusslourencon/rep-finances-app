import {
  InvalidAmountError,
  InvalidUserIdError,
  InvalidDateError,
  InvalidLabelError
} from '@entities/atomics/errors'
import { Transaction, TransactionInitProps } from '@entities/Transaction'
import { InvalidPaymentError } from '@entities/Transaction/errors'

import { left } from '@shared/Either'

describe('Transaction', () => {
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
    const transactionOrError = Transaction.create(transactionInit)

    expect(transactionOrError.isRight()).toBeTruthy()

    const transaction = (<Transaction>transactionOrError.value).value

    expect(transaction).toHaveProperty('_id')
    expect(transaction.amount).toBe(20)
    expect(transaction.month).toBe('202012')
    expect(transaction.related).toStrictEqual(['P', 'F', 'G'])
  })

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
    const transactionOrError = Transaction.create(transactionInit)

    expect(transactionOrError).toEqual(left(new InvalidLabelError('X')))
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
    const transactionOrError = Transaction.create(transactionInit)

    expect(transactionOrError).toEqual(
      left(new InvalidDateError(NaN.toString()))
    )
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
    const transactionOrError = Transaction.create(transactionInit)

    expect(transactionOrError).toEqual(left(new InvalidUserIdError('__')))
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
    const transactionOrError = Transaction.create(transactionInit)

    expect(transactionOrError).toEqual(left(new InvalidAmountError('-20')))
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
    const transactionOrError = Transaction.create(transactionInit)

    expect(transactionOrError).toEqual(left(new InvalidPaymentError()))
  })
})
