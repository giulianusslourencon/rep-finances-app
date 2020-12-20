export interface ICreateTransactionRequestDTO {
  title: string
  timestamp: number | string
  items: {
    [title: string]: {
      value: number
      related_users: string[]
    }
  }
  payers: {
    [user_id: string]: number
  }
}
