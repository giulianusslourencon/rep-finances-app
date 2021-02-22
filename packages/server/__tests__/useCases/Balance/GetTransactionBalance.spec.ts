import { right } from '@shared/Either'

import { GetTransactionBalanceUseCase } from '@useCases/Balance/implementations'

import { transactionToSave } from './testData'

const getTransactionBalanceUseCase = new GetTransactionBalanceUseCase()

describe('Get transaction balance use case', () => {
  it('Should calculate the transaction balance', async () => {
    const balance = await getTransactionBalanceUseCase.execute({
      transaction: transactionToSave
    })

    expect(balance).toEqual(right({ individual_balance: { P: 5, D: -5 } }))
  })
})
