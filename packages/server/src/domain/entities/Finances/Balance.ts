import { Path } from '@shared/utils'

import { EntityErrorHandler } from '@errors/contracts'

import { UserId } from '@entities/components'
import { IBalanceable } from '@entities/Finances'

export type IndividualBalanceProps = {
  [userId: string]: number
}

export class Balance implements IBalanceable {
  constructor(private readonly balance: IndividualBalanceProps) {}

  static create(
    balance: IndividualBalanceProps,
    errorHandler: EntityErrorHandler,
    path = new Path()
  ): Balance {
    Object.keys(balance).forEach(userId => {
      if (!balance[userId]) delete balance[userId]
    })

    const finalList: [UserId, number][] = []
    for (const [userId, amount] of Object.entries(balance)) {
      const id = UserId.create(userId, errorHandler, path.add(userId))
      finalList.push([id, amount])
    }

    const formattedBalance: IndividualBalanceProps = {}
    for (const [userId, amount] of finalList) {
      balance[userId.value] = amount
    }

    return new Balance(formattedBalance)
  }

  extractBalance(): IndividualBalanceProps {
    return this.balance
  }

  get value(): IndividualBalanceProps {
    return this.balance
  }
}
