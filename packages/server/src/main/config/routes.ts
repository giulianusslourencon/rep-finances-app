import { Express, Router } from 'express'

import { readdirSync } from 'fs'
import path from 'path'

const DIRNAME =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.resolve('dist', 'main', 'config')

export const setupRoutes = (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  readdirSync(path.resolve(DIRNAME, '..', 'routes')).map(async fileName => {
    if (!fileName.includes('.test.')) {
      ;(await import(`../routes/${fileName}`)).default(router)
    }
  })
}
