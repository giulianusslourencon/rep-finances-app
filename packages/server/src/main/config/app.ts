import express from 'express'

import { setupMiddleware } from '@main/config/middleware'
import { setupRoutes } from '@main/config/routes'
import { setupSwagger } from '@main/docs'

const app = express()

setupMiddleware(app)
setupSwagger(app)
setupRoutes(app)

export { app }
