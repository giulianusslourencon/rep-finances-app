import { EntityErrorHandler } from '@entities/errors'
import { Balance, IBalanceable } from '@entities/Finances'

export class BalanceJoiner {
  static joinBalances(entities: IBalanceable[]): Balance {
    const finalBalance = entities
      .map(entity => entity.extractBalance())
      .reduce((acc, cur) => {
        for (const [userId, user_balance] of Object.entries(cur)) {
          acc[userId] = (acc[userId] || 0) + user_balance
        }
        return acc
      }, {})

    return Balance.create(finalBalance, new EntityErrorHandler())
  }
}
