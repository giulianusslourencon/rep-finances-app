/* eslint-disable import/no-extraneous-dependencies */
import { app } from '@main/config/app'
import { MongoBalance, MongoTransactions } from '@main/factories'
import request from 'supertest'

describe('Content Type Middleware', () => {
  afterAll(async () => {
    await MongoBalance.disconnect()
    await MongoTransactions.disconnect()
  })

  test('should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app).get('/test_content_type').expect('content-type', /json/)
  })

  test('should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
