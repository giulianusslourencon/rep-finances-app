/* eslint-disable import/no-extraneous-dependencies */
import { app } from '@main/config/app'
import { MongoBalance, MongoTransactions } from '@main/factories'
import request from 'supertest'

describe('Body parser Middleware', () => {
  afterAll(async () => {
    await MongoBalance.disconnect()
    await MongoTransactions.disconnect()
  })

  test('should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Otavio' })
      .expect({ name: 'Otavio' })
  })
})
