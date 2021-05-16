import { EntityErrorHandler } from '@entities/errors'
import { RelatedList } from '@entities/Finances'

describe('Related List Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a list with valid related users', () => {
      const errorHandler = new EntityErrorHandler()
      const related_users = ['P', 'G  ', 'm']
      const relatedList = RelatedList.create(related_users, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(relatedList.value).toStrictEqual(['P', 'G', 'M'])
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a list with invalid related users', () => {
      const errorHandler = new EntityErrorHandler()
      const related_users = ['P', 'G', '@']
      RelatedList.create(related_users, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('@')
      expect(errorHandler.errors[0].error.name).toBe('InvalidUserIdError')
    })

    it('Should not allow an empty list', () => {
      const errorHandler = new EntityErrorHandler()
      RelatedList.create([], errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('')
      expect(errorHandler.errors[0].error.name).toBe('InvalidRelatedListError')
    })

    it('Should not allow duplicated ids in a list', () => {
      const errorHandler = new EntityErrorHandler()
      const related_users = ['P', 'p ', 'g']
      RelatedList.create(related_users, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('p ')
      expect(errorHandler.errors[0].error.name).toBe('InvalidRelatedListError')
    })
  })
})
