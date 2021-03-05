export interface CountTransactionsTransactionsRepository {
  count(): Promise<number>
  countByMonth(month: string): Promise<number>
}
