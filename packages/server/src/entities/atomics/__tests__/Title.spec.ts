import { Title } from '@entities/atomics'
import { InvalidTitleError } from '@entities/atomics/errors'

import { left } from '@shared/Either'

describe('Title', () => {
  it('Should allow valid titles', () => {
    const titleOrError = Title.create('Titulo')

    expect(titleOrError.isRight()).toBeTruthy()
    expect((<Title>titleOrError.value).value).toBe('Titulo')
  })

  it('Should not allow titles with too few characteres', () => {
    const titleOrError = Title.create('A')

    expect(titleOrError).toEqual(left(new InvalidTitleError('A')))
  })

  it('Should not allow titles with too many characteres', () => {
    const title = 'A'.repeat(256)
    const titleOrError = Title.create(title)

    expect(titleOrError).toEqual(left(new InvalidTitleError(title)))
  })

  it('Should not allow titles with only blank spaces', () => {
    const titleOrError = Title.create('   ')

    expect(titleOrError).toEqual(left(new InvalidTitleError('   ')))
  })
})
