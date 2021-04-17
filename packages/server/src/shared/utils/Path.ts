export class Path {
  private fields: string[]

  constructor(initialFields?: string[]) {
    this.fields = initialFields ? [...initialFields] : []
  }

  public add(...newFields: string[]): Path {
    return new Path([...this.fields, ...newFields])
  }

  public resolve(): string {
    return this.fields.join('.')
  }
}
