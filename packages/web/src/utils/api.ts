import axios from 'axios'
import { api_url } from 'src/config/env'

export default axios.create({
  baseURL: `${api_url}/api/`,
  responseType: 'json'
})
