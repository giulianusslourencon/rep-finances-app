/* eslint-disable import/no-extraneous-dependencies */
import { app } from '@main/config/app'
import { MongoBalance, MongoTransactions } from '@main/factories/external'
import request from 'supertest'

describe('CORS Middleware', () => {
  afterAll(async () => {
    await MongoBalance.disconnect()
    await MongoTransactions.disconnect()
  })

  test('should enable CORS', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
