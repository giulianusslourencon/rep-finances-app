import axios, { AxiosInstance } from 'axios'
import { api_url } from 'src/config/env'

import {
  Balance,
  Transaction,
  TransactionDetails,
  TransactionList
} from './types'

class Api {
  private axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${api_url}/api/`,
      responseType: 'json'
    })
  }

  getCurrentBalance() {
    return this.axios.get<Balance>('/balance')
  }

  listTransactions(page = 1) {
    return this.axios.get<TransactionList>(`/transactions?page=${page}`)
  }

  getTransaction(id: string) {
    return this.axios.get<TransactionDetails>(`/transactions/${id}`)
  }

  createTransaction(transaction: Transaction) {
    return this.axios.post('/transactions', transaction)
  }
}

export default new Api()
