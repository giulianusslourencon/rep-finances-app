import express from 'express'

import { setupMiddleware } from '@main/config/middleware'
import { setupRoutes } from '@main/config/routes'
import { setupSwagger } from '@main/config/swagger'

const app = express()

setupSwagger(app)
setupMiddleware(app)
setupRoutes(app)

export { app }
