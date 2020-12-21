import { InvalidRelatedError } from '@entities/atomics/errors/InvalidRelated'

import { left } from '@shared/Either'

import { IndividualBalance } from '../IndividualBalance'

describe('Individual balance validator', () => {
  it('Should allow balance with valid related', () => {
    const individualBalance = {
      P: 5,
      G: -5
    }
    const individualBalanceOrError = IndividualBalance.create(individualBalance)

    expect(individualBalanceOrError.isRight()).toBeTruthy()
    expect(
      (<IndividualBalance>individualBalanceOrError.value).value
    ).toStrictEqual(individualBalance)
  })

  it('Should not allow balance with invalid related', () => {
    const individualBalance = {
      AAAAA: 0
    }
    const individualBalanceOrError = IndividualBalance.create(individualBalance)

    expect(individualBalanceOrError).toEqual(
      left(new InvalidRelatedError('AAAAA'))
    )
  })
})