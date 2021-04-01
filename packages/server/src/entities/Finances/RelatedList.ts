import { UserId } from '@entities/components'
import { InvalidError } from '@entities/errors'
import { DuplicateReason, EmptyReason } from '@entities/errors/reasons'

import { Either, left, right } from '@shared/types'

export class RelatedList {
  private readonly relatedList: UserId[]

  private constructor(relatedList: UserId[]) {
    this.relatedList = [...relatedList]
    Object.freeze(this)
  }

  static create(relatedList: string[]): Either<InvalidError, RelatedList> {
    const finalList: UserId[] = []
    for (const related of relatedList) {
      const relatedOrError = UserId.create(related)

      if (relatedOrError.isLeft()) return left(relatedOrError.value)

      const duplicated = finalList.filter(
        item => item.value === relatedOrError.value.value
      )
      if (duplicated.length > 0)
        return left(
          new InvalidError(
            'Related List',
            relatedOrError.value.value,
            new DuplicateReason('id')
          )
        )

      finalList.push(relatedOrError.value)
    }

    if (!RelatedList.validate(finalList))
      return left(new InvalidError('Related List', '', new EmptyReason()))

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
