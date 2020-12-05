import DateParser from '../DateParser'

describe('Date Parser', () => {
  it('Should return the date parsed on default timeZone.', () => {
    // "Sun Jan 31 2021 23:00:00 GMT-0300 (Brasilia Standard Time)"
    const parsedDate = DateParser.parseDate(1612144800000)

    expect(parsedDate).toBe('202101')
  })

  it('Should return the date parsed on given timeZone.', () => {
    // "Mon, 01 Feb 2021 02:00:00 GMT"
    const parsedDate = DateParser.parseDate(1612144800000, 'UTC')

    expect(parsedDate).toBe('202102')
  })
})
