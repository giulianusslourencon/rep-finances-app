/* eslint-disable import/no-extraneous-dependencies */
import { app } from '@main/config/app'
import { MongoBalance, MongoTransactions } from '@main/factories'
import request from 'supertest'

describe('Transaction routes', () => {
  afterAll(async () => {
    await MongoTransactions.disconnect()
    await MongoBalance.disconnect()
  })

  beforeEach(async () => {
    await MongoTransactions.clearCollection()
    await MongoBalance.clearCollection()
  })

  it('Should list all registered transactions', async () => {
    await request(app).get('/api/transactions').send().expect(200)
  })

  it('Should return the transactions count', async () => {
    await request(app).get('/api/transactions/count').send().expect(200)
  })

  it('Should create a new transaction', async () => {
    await request(app)
      .post('/api/transactions')
      .send({
        items: {
          item: {
            related_users: ['P', 'D'],
            value: 10
          }
        },
        payers: {
          P: 10
        },
        timestamp: 1608865200000,
        title: 'Vinho pra gay night de Natal'
      })
      .expect(201)
  })

  it('Should not find a not registered transaction', async () => {
    await request(app)
      .get('/api/transactions/id-not-registered')
      .send()
      .expect(404)
  })
})
