export interface CreateTransactionBalanceRepository {
  setNotUpdatedFromMonth(month: string): Promise<void>
}
