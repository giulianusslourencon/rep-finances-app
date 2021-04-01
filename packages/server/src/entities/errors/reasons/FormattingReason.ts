import { IErrorReason } from '@entities/errors'

export class FormattingReason implements IErrorReason {
  describe(entity: string): string {
    return `The ${entity.toLowerCase()} may be poorly formatted.`
  }
}
