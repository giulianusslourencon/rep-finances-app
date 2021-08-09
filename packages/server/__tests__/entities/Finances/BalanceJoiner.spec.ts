import { TransactionBuilder } from '@tests/builders/Finances'

import { Balance, BalanceJoiner, IBalanceable } from '@entities/Finances'

describe('Balance Joiner', () => {
  describe('Success Cases', () => {
    it('Should join the balances given a list of balanceables', () => {
      const balanceables: IBalanceable[] = [
        TransactionBuilder.aTransaction().build(),
        new Balance({
          D: 5,
          P: 5,
          G: -10
        })
      ]

      const finalBalance = BalanceJoiner.joinBalances(balanceables)

      expect(finalBalance.value).toStrictEqual({ P: 10, G: -10 })
    })
  })
})
