import mongoose from 'mongoose'

import mongoConfig from '@repositories/mongodb/config/mongo'

const mongoUserPass = mongoConfig.username
  ? `${mongoConfig.username}:${mongoConfig.password}@`
  : ''

mongoose
  .connect(
    `mongodb://${mongoUserPass}${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log('Mongo connected')
  })
  .catch(() => {
    console.log('Error on connection with mongo')
  })
