import { UserId } from '@entities/components'
import { EntityErrorHandler, InvalidError } from '@entities/errors'
import { DuplicateReason, EmptyReason } from '@entities/errors/reasons'

export class RelatedList {
  private readonly relatedList: UserId[]

  private constructor(relatedList: UserId[]) {
    this.relatedList = [...relatedList]
    Object.freeze(this)
  }

  static create(
    relatedList: string[],
    errorHandler: EntityErrorHandler,
    path = ''
  ): RelatedList {
    const finalList: UserId[] = []
    for (const related of relatedList) {
      const relatedUser = UserId.create(
        related,
        errorHandler,
        `${path}.${related}`
      )

      const duplicated = finalList.filter(
        item => item.value === relatedUser.value
      )
      if (duplicated.length > 0)
        errorHandler.addError(
          new InvalidError(
            'Related List',
            relatedUser.value,
            new DuplicateReason('id')
          ),
          `${path}.${related}`
        )

      finalList.push(relatedUser)
    }

    if (!RelatedList.validate(finalList))
      errorHandler.addError(
        new InvalidError('Related List', '', new EmptyReason()),
        path
      )

    return new RelatedList(finalList)
  }

  get value(): string[] {
    return this.relatedList.map(related => related.value)
  }

  static validate(relatedList: UserId[]): boolean {
    if (relatedList.length === 0) return false
    return true
  }
}
