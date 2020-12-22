import { InvalidRelatedError } from '@entities/atomics/errors'
import { RelatedList } from '@entities/Transaction'
import { EmptyListError } from '@entities/Transaction/errors'

import { left } from '@shared/Either'

describe('Related list', () => {
  it('Should allow a list with valid related users', () => {
    const related_users = ['P', 'G', 'M']
    const relatedListOrError = RelatedList.create(related_users)

    expect(relatedListOrError.isRight()).toBeTruthy()
    expect((<RelatedList>relatedListOrError.value).value).toStrictEqual(
      related_users
    )
  })

  it('Should not allow a list with invalid related users', () => {
    const related_users = ['P', 'G', '@']
    const relatedListOrError = RelatedList.create(related_users)

    expect(relatedListOrError).toEqual(left(new InvalidRelatedError('@')))
  })

  it('Should not allow an empty list', () => {
    const related_users: string[] = []
    const relatedListOrError = RelatedList.create(related_users)

    expect(relatedListOrError).toEqual(left(new EmptyListError()))
  })
})
