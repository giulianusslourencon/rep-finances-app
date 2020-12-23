export interface IRepository {
  collection: string

  connect(): Promise<void>
  disconnect(): Promise<void>
  clearCollection(): Promise<void>
}
