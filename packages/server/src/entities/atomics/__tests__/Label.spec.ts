import { Label } from '@entities/atomics'
import { InvalidLabelError } from '@entities/atomics/errors'

import { left } from '@shared/Either'

describe('Label', () => {
  it('Should allow valid labels and trim on save', () => {
    const labelOrError = Label.create('Label   ')

    expect(labelOrError.isRight()).toBeTruthy()
    expect((<Label>labelOrError.value).value).toBe('Label')
  })

  it('Should not allow labels with too few characteres', () => {
    const labelOrError = Label.create('A')

    expect(labelOrError).toEqual(left(new InvalidLabelError('A')))
  })

  it('Should not allow labels with too many characteres', () => {
    const title = 'A'.repeat(256)
    const labelOrError = Label.create(title)

    expect(labelOrError).toEqual(left(new InvalidLabelError(title)))
  })

  it('Should not allow labels with only blank spaces', () => {
    const labelOrError = Label.create('   ')

    expect(labelOrError).toEqual(left(new InvalidLabelError('   ')))
  })
})
