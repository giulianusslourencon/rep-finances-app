import { UserId } from '@entities/atomics'
import { InvalidUserIdError } from '@entities/atomics/errors'
import {
  DuplicatedUserIdOnListError,
  EmptyListError
} from '@entities/Transaction/errors'

import { Either, left, right } from '@shared/Either'

export class RelatedList {
  private readonly relatedList: UserId[]

  private constructor(relatedList: UserId[]) {
    this.relatedList = [...relatedList]
    Object.freeze(this)
  }

  static create(
    relatedList: string[]
  ): Either<InvalidUserIdError | EmptyListError, RelatedList> {
    const finalList: UserId[] = []
    for (const related of relatedList) {
      const relatedOrError = UserId.create(related)

      if (relatedOrError.isLeft()) return left(relatedOrError.value)

      const duplicated = finalList.filter(
        item => item.value === relatedOrError.value.value
      )
      if (duplicated.length > 0)
        return left(new DuplicatedUserIdOnListError(relatedOrError.value.value))

      finalList.push(relatedOrError.value)
    }

    if (!RelatedList.validate(finalList)) return left(new EmptyListError())

    return right(new RelatedList(finalList))
  }

  get value(): string[] {
    return this.relatedList.map(related => related.value)
  }

  static validate(relatedList: UserId[]): boolean {
    if (relatedList.length === 0) return false
    return true
  }
}
