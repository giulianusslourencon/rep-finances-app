export interface IListTransactionsRequestDTO {
  skipLimit?: {
    skip: number
    limit: number
  }
  month?: string
}
