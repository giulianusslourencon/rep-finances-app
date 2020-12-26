import { Express, Router } from 'express'

import { readdirSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

export const setupRoutes = (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  const __dirname = dirname(fileURLToPath(import.meta.url))

  readdirSync(path.join(__dirname, '..', 'routes')).map(async fileName => {
    if (!fileName.includes('.test.')) {
      ;(await import(`../routes/${fileName}`)).default(router)
    }
  })
}
