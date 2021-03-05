import { Balance, BalanceProps } from '@entities/Balance'

describe('Balance Entity', () => {
  describe('Success Cases', () => {
    it('Should remove related users with null balance', () => {
      const balance: BalanceProps = {
        individual_balance: {
          P: 10,
          G: -10,
          M: 0
        }
      }

      const balanceOrError = Balance.create(balance)

      expect(balanceOrError.isRight()).toBeTruthy()
      expect(
        (<Balance>balanceOrError.value).value.individual_balance
      ).toStrictEqual({ P: 10, G: -10 })
    })
  })
})
