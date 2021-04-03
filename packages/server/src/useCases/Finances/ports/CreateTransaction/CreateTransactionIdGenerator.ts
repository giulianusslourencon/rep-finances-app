export interface CreateTransactionIdGenerator {
  generateUniqueId: () => Promise<string>
}
