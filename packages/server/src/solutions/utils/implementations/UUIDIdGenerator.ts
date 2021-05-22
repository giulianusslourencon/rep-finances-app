import { v4 as uuid } from 'uuid'

import { IIdGenerator } from '@utils/ports'

export class UUIDIdGenerator implements IIdGenerator {
  async generateUniqueId(): Promise<string> {
    return uuid()
  }
}
