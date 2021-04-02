import { TransactionInitialPropsBuilder } from '@tests/builders'

import { right } from '@shared/types'

import { GetTransactionBalanceUseCase } from '@useCases/Finances/implementations'

const getTransactionBalanceUseCase = new GetTransactionBalanceUseCase()

describe('Get Transaction Balance Use Case', () => {
  describe('Success Cases', () => {
    it('Should calculate the transaction balance', async () => {
      const balance = await getTransactionBalanceUseCase.execute({
        transaction: TransactionInitialPropsBuilder.aTransaction().build()
      })

      expect(balance).toEqual(right({ individual_balance: { P: 5, D: -5 } }))
    })
  })
})
