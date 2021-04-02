import { InvalidFields } from '@entities/errors'
import { RelatedList } from '@entities/Finances'

describe('Related List Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a list with valid related users', () => {
      const related_users = ['P', 'G', 'M']
      const relatedListOrError = RelatedList.create(related_users)

      expect(relatedListOrError.isRight()).toBeTruthy()
      expect((<RelatedList>relatedListOrError.value).value).toStrictEqual(
        related_users
      )
    })
  })

  describe('Error Cases', () => {
    it('Should not allow a list with invalid related users', () => {
      const related_users = ['P', 'G', '@']
      const relatedListOrError = RelatedList.create(related_users)

      expect(relatedListOrError.isLeft()).toBeTruthy()
      expect(relatedListOrError.value).toEqual<InvalidFields>([
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
      const related_users: string[] = []
      const relatedListOrError = RelatedList.create(related_users)

      expect(relatedListOrError.isLeft()).toBeTruthy()
      expect(relatedListOrError.value).toEqual<InvalidFields>([
        {
          error: {
            name: 'InvalidRelatedListError',
            value: '',
            reason: 'There must be at least one item in the related list.'
          }
        }
      ])
    })

    it('Should not allow duplicated ids in a list', () => {
      const related_users = ['P', 'p ', 'g', 'G']
      const relatedListOrError = RelatedList.create(related_users)

      expect(relatedListOrError.isLeft()).toBeTruthy()
      expect(relatedListOrError.value).toEqual<InvalidFields>([
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
