import request from 'supertest'
import { app } from '@server/app'
import * as data from './testData'

describe('Create transaction', () => {
  it('Should create a transaction and return a Created status code and the created Transaction.', async () => {
    const response = await request(app)
      .post('/transactions')
      .send(data.transactionSuccess)
      .expect(201)
    
    expect(response.body).toHaveProperty('_id')
    expect(response.body).toHaveProperty('amount')
    expect(response.body.amount).toBe(50)
  })

  it('Should not create a transaction with total items values distinct from total paid.', async () => {
    const response = await request(app)
      .post('/transactions')
      .send(data.transactionDistinctValues)
      .expect(406)
    
    expect(response.body.message).toBe('Items values are distinct from total paid')
  })

  it('Should not create a transaction with amount equal to 0.', async () => {
    const response = await request(app)
      .post('/transactions')
      .send(data.transactionNoMoney)
      .expect(406)
    
    expect(response.body.message).toBe('There must be some money involved in the transaction')
  })

  it('Should not create a transaction with negative or null items values or payers amount.', async () => {
    const response = await request(app)
      .post('/transactions')
      .send(data.transactionNegativeNull)
      .expect(406)
    
    expect(response.body.message).toBe('All items values and payers amount must be a positive number')
  })
})