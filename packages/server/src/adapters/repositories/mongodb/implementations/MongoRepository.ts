import mongoose, { Mongoose } from 'mongoose'

import mongoConfig from '@repositories/mongodb/config'
import { IRepository } from '@repositories/ports'

export abstract class MongoRepository implements IRepository {
  abstract collection: string

  private database!: Mongoose

  constructor() {
    this.connect()
  }

  async connect(): Promise<void> {
    const mongoUserPass = mongoConfig.username
      ? `${mongoConfig.username}:${mongoConfig.password}@`
      : ''

    const uri = mongoConfig.host.split('://')[0].startsWith('mongodb')
      ? mongoConfig.host
      : `mongodb://${mongoUserPass}${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`

    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        keepAlive: true
      })
      .then(database => {
        console.log(`Mongo ${this.collection} connected`)
        this.database = database
      })
      .catch(() => {
        console.log(`Error on connection with mongo ${this.collection}`)
      })
  }

  disconnect(): Promise<void> {
    return this.database.connection.close()
  }

  abstract clearCollection(): Promise<void>
}
