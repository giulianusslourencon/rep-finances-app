import { Router } from 'express'

import { adaptRoute } from '@main/adapters'
import { makeGetCurrentBalance } from '@main/factories'

export default (router: Router): void => {
  router.get('/balance', adaptRoute(makeGetCurrentBalance()))
}
