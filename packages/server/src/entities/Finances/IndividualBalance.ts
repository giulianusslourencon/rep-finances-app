import { UserId } from '@entities/components'
import { EntityErrorHandler } from '@entities/errors'

export type IndividualBalanceProps = {
  [userId: string]: number
}

type ValidatedBalance = [UserId, number][]

export class IndividualBalance {
  private readonly balance: ValidatedBalance

  private constructor(balance: ValidatedBalance) {
    this.balance = [...balance]
    Object.freeze(this)
  }

  static create(
    balance: IndividualBalanceProps,
    errorHandler: EntityErrorHandler,
    path = ''
  ): IndividualBalance {
    const finalList: ValidatedBalance = []
    for (const [userId, amount] of Object.entries(balance)) {
      const id = UserId.create(userId, errorHandler, `${path}.${userId}`)
      finalList.push([id, amount])
    }
    return new IndividualBalance(finalList)
  }

  get value(): IndividualBalanceProps {
    const balance: IndividualBalanceProps = {}
    for (const [userId, amount] of this.balance) {
      balance[userId.value] = amount
    }
    return balance
  }
}
