/* eslint-disable import/no-extraneous-dependencies */
import { app } from '@main/config/app'
import { MongoBalance, MongoTransactions } from '@main/factories'
import request from 'supertest'

describe('Balance routes', () => {
  afterAll(async () => {
    await MongoTransactions.disconnect()
    await MongoBalance.disconnect()
  })

  beforeEach(async () => {
    await MongoTransactions.clearCollection()
    await MongoBalance.clearCollection()
  })

  it('Should get the current balance', async () => {
    await request(app).get('/api/balance').send().expect(200)
  })
})
