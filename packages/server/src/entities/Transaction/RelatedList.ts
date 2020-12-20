import { Either, left, right } from '@shared/Either'

import { EmptyListError } from './errors/EmptyList'
import { InvalidRelatedError } from './errors/InvalidRelated'
import { Related } from './Related'

export class RelatedList {
  private readonly relatedList: Related[]

  private constructor(relatedList: Related[]) {
    this.relatedList = [...relatedList]
    Object.freeze(this)
  }

  static setList(relatedList: Related[]): Either<EmptyListError, RelatedList> {
    if (!RelatedList.validate(relatedList)) return left(new EmptyListError())

    return right(new RelatedList(relatedList))
  }

  static create(
    relatedList: string[]
  ): Either<InvalidRelatedError | EmptyListError, RelatedList> {
    const finalList: Related[] = []
    for (const related of relatedList) {
      const relatedOrError = Related.create(related)

      if (relatedOrError.isLeft()) return left(relatedOrError.value)

      finalList.push(relatedOrError.value)
    }

    if (!RelatedList.validate(finalList)) return left(new EmptyListError())

    return right(new RelatedList(finalList))
  }

  get value(): Related[] {
    return this.relatedList
  }

  static validate(relatedList: Related[]): boolean {
    if (relatedList.length === 0) return false
    return true
  }
}
