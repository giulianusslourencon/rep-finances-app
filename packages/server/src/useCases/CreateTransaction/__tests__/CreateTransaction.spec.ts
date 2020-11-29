import request from 'supertest'
import { app } from '../../../app'
import { transactionSuccess } from './testData'

describe('Create transaction', () => {
  it('Should create a transaction and return a Created status code', async () => {
    await request(app)
      .post('/transactions')
      .send(transactionSuccess)
      .expect(201)
  })
})