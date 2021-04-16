import { Path } from '@shared/utils'

describe('Path', () => {
  it('Should create a new path with a given array of fields and merge them with a dot separator', () => {
    const path = new Path(['field1', 'field2', 'field3'])

    expect(path.resolve()).toBe('field1.field2.field3')
  })

  it('Should add a new field to the path sequence', () => {
    const path = new Path(['field1', 'field2'])
    const addedPath = path.add('field3')

    expect(path.resolve()).toBe('field1.field2')
    expect(addedPath.resolve()).toBe('field1.field2.field3')
  })

  it('Should return an empty string if there is no field on the path sequence', () => {
    const path = new Path()

    expect(path.resolve()).toBe('')
  })
})
