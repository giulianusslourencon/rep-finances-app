import { IIdGenerator } from '@utils/ports'

export const makeIdGeneratorStub = (): IIdGenerator => {
  class IdGeneratorStub implements IIdGenerator {
    generateUniqueId = async () => 'id'
  }

  return new IdGeneratorStub()
}
