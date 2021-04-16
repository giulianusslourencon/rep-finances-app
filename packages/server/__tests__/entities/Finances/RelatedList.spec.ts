import { EntityErrorHandler, InvalidFields } from '@entities/errors'
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
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: '@',
          error: {
            name: 'InvalidUserIdError',
            value: '@',
            reason:
              'The id cannot contain special characters, nor can it contain a number in the first position.'
          }
        }
      ])
    })

    it('Should not allow an empty list', () => {
      const errorHandler = new EntityErrorHandler()
      RelatedList.create([], errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          error: {
            name: 'InvalidRelatedListError',
            value: '',
            reason: 'There must be at least one item in the related list.'
          },
          field: ''
        }
      ])
    })

    it('Should not allow duplicated ids in a list', () => {
      const errorHandler = new EntityErrorHandler()
      const related_users = ['P', 'p ', 'g', 'G']
      RelatedList.create(related_users, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: 'p ',
          error: {
            name: 'InvalidRelatedListError',
            value: 'P',
            reason:
              'There cannot be two items in the related list with the same id.'
          }
        },
        {
          field: 'G',
          error: {
            name: 'InvalidRelatedListError',
            value: 'G',
            reason:
              'There cannot be two items in the related list with the same id.'
          }
        }
      ])
    })
  })
})
