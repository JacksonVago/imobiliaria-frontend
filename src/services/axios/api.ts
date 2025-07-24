import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:98'
})

export default api
