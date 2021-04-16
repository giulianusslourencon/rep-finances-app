import { StringCapitalizer } from '@shared/utils'

describe('String Capitalizer', () => {
  it('Should uppercase the first character on a string', () => {
    expect(StringCapitalizer.capitalizeFirstLetter('banana')).toBe('Banana')
  })

  it('Should do nothing if the strings first character is already uppercased', () => {
    expect(StringCapitalizer.capitalizeFirstLetter('BAnana')).toBe('BAnana')
  })
})
