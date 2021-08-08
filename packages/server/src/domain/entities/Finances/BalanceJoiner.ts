import { IBalanceable, IndividualBalanceProps } from '@entities/Finances'

export class BalanceJoiner {
  static joinBalances(entities: IBalanceable[]): IndividualBalanceProps {
    return entities
      .map(entity => entity.extractBalance())
      .reduce((acc, cur) => {
        for (const [userId, user_balance] of Object.entries(cur)) {
          acc[userId] = (acc[userId] || 0) + user_balance
        }
        return acc
      }, {})
  }
}
