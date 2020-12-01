export interface ICreateTransactionRequestDTO {
  title: string
  month: string
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