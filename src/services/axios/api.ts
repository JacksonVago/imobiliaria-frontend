import axios from 'axios'

const api = axios.create({
  //baseURL: 'http://localhost:98'
  baseURL: 'http://4.155.200.47:98'
});

export default api
