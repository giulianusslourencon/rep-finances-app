import { Path } from '@shared/utils'

import { IErrorHandler, InvalidError } from '@errors/contracts'
import { DuplicateReason, EmptyReason } from '@errors/reasons'

import { UserId } from '@entities/components'

export class RelatedList {
  constructor(private readonly relatedList: string[]) {}

  static create(
    relatedList: string[],
    errorHandler: IErrorHandler,
    path = new Path()
  ): RelatedList {
    const finalList: UserId[] = []
    for (const related of relatedList) {
      const relatedUser = UserId.create(
        related,
        errorHandler,
        path.add(related)
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
          path.add(related).resolve()
        )

      finalList.push(relatedUser)
    }

    if (!RelatedList.validate(finalList))
      errorHandler.addError(
        new InvalidError('Related List', '', new EmptyReason()),
        path.resolve()
      )

    return new RelatedList(finalList.map(related => related.value))
  }

  get value(): string[] {
    return this.relatedList
  }

  private static validate(relatedList: UserId[]): boolean {
    return relatedList.length > 0
  }
}
