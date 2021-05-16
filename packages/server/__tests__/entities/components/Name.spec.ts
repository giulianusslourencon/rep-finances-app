import { Name } from '@entities/components'
import { EntityErrorHandler } from '@entities/errors'

describe('Name Entity', () => {
  describe('Success Cases', () => {
    it('Should allow valid names and trim on save', () => {
      const errorHandler = new EntityErrorHandler()
      const name = Name.create('Name   ', errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(name.value).toBe('Name')
    })
  })

  describe('Error Cases', () => {
    it('Should not allow names with too few characteres', () => {
      const errorHandler = new EntityErrorHandler()
      Name.create('A', errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
    })

    it('Should not allow names with too many characteres', () => {
      const errorHandler = new EntityErrorHandler()
      const title = 'A'.repeat(65)
      Name.create(title, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
    })

    it('Should not allow names with only blank spaces', () => {
      const errorHandler = new EntityErrorHandler()
      Name.create('   ', errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
    })
  })
})
