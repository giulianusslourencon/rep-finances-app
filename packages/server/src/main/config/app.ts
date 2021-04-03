import express from 'express'

import { setupMiddleware, setupRoutes } from '@main/config'

const app = express()

setupMiddleware(app)
setupRoutes(app)

export { app }
