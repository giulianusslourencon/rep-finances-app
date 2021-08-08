import { EntityErrorHandler } from '@errors/contracts'

import { Path } from '@shared/utils'

import { IndividualBalance, IndividualBalanceProps } from '@entities/Finances'

export type BalanceProps = {
  individual_balance: IndividualBalanceProps
}

export class Balance {
  public individual_balance!: IndividualBalance

  protected constructor(individual_balance: IndividualBalance) {
    this.individual_balance = individual_balance
    Object.freeze(this)
  }

  static create(
    balance: BalanceProps,
    errorHandler: EntityErrorHandler,
    path = new Path()
  ): Balance {
    Object.keys(balance.individual_balance).forEach(userId => {
      if (!balance.individual_balance[userId])
        delete balance.individual_balance[userId]
    })

    const individualBalance = IndividualBalance.create(
      balance.individual_balance,
      errorHandler,
      path.add('individual_balance')
    )

    return new Balance(individualBalance)
  }

  get value(): BalanceProps {
    return { individual_balance: this.individual_balance.value }
  }
}
