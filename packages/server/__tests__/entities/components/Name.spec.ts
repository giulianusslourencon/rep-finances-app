import { Name } from '@entities/components'
import { InvalidError } from '@entities/errors'

describe('Name Entity', () => {
  describe('Success Cases', () => {
    it('Should allow valid names and trim on save', () => {
      const nameOrError = Name.create('Name   ')

      expect(nameOrError.isRight()).toBeTruthy()
      expect((<Name>nameOrError.value).value).toBe('Name')
    })
  })

  describe('Error Cases', () => {
    it('Should not allow names with too few characteres', () => {
      const nameOrError = Name.create('A')

      expect(nameOrError.isLeft()).toBeTruthy()
      expect(nameOrError.value).toEqual<InvalidError>({
        name: 'InvalidNameError',
        value: 'A',
        reason: 'The name must contain between 2 and 64 characteres.'
      })
    })

    it('Should not allow names with too many characteres', () => {
      const title = 'A'.repeat(65)
      const nameOrError = Name.create(title)

      expect(nameOrError.isLeft()).toBeTruthy()
      expect(nameOrError.value).toEqual<InvalidError>({
        name: 'InvalidNameError',
        value: title,
        reason: 'The name must contain between 2 and 64 characteres.'
      })
    })

    it('Should not allow names with only blank spaces', () => {
      const nameOrError = Name.create('   ')

      expect(nameOrError.isLeft()).toBeTruthy()
      expect(nameOrError.value).toEqual<InvalidError>({
        name: 'InvalidNameError',
        value: '   ',
        reason: 'The name must contain between 2 and 64 characteres.'
      })
    })
  })
})
