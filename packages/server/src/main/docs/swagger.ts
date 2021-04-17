import { Express } from 'express'

import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

const swaggerDocument = YAML.load('src/main/docs/swagger.yaml')

export const setupSwagger = (app: Express): void => {
  app.get('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
