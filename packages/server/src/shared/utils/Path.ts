export class Path {
  private fields: string[]

  constructor(initialFields?: string[]) {
    this.fields = initialFields ? [...initialFields] : []
  }

  public add(field: string): Path {
    return new Path([...this.fields, field])
  }

  public resolve(): string {
    return this.fields.join('.')
  }
}
