import { InvalidAmountError } from '@entities/atomics/errors/InvalidAmount'
import { InvalidRelatedError } from '@entities/atomics/errors/InvalidRelated'

import { TransactionPayersProps } from '@shared/@types/Transaction'
import { left } from '@shared/Either'

import { EmptyListError } from '../errors/EmptyList'
import { TransactionPayers } from '../TransactionPayers'

describe('Transaction payers', () => {
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

  it('Should not allow a list with invalid related', () => {
    const items: TransactionPayersProps = {
      AAAA: 30
    }
    const transactionPayersOrError = TransactionPayers.create(items)

    expect(transactionPayersOrError).toEqual(
      left(new InvalidRelatedError('AAAA'))
    )
  })

  it('Should not allow a list with invalid value', () => {
    const items: TransactionPayersProps = {
      P: 20,
      G: -2
    }
    const transactionPayersOrError = TransactionPayers.create(items)

    expect(transactionPayersOrError).toEqual(left(new InvalidAmountError('-2')))
  })

  it('Should not allow an empty list', () => {
    const items: TransactionPayersProps = {}
    const transactionPayersOrError = TransactionPayers.create(items)

    expect(transactionPayersOrError).toEqual(left(new EmptyListError()))
  })
})
