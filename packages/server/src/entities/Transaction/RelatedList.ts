import { Either, left, right } from '@shared/Either'

import { InvalidRelatedError } from '../atomics/errors/InvalidRelated'
import { Related } from '../atomics/Related'
import { EmptyListError } from './errors/EmptyList'

export class RelatedList {
  private readonly relatedList: Related[]

  private constructor(relatedList: Related[]) {
    this.relatedList = [...relatedList]
    Object.freeze(this)
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

  get value(): string[] {
    return this.relatedList.map(related => related.value)
  }

  static validate(relatedList: Related[]): boolean {
    if (relatedList.length === 0) return false
    return true
  }
}
