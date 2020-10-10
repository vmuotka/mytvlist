import axios from 'axios'
const baseUrl = '/api/user'

const login = async credentials => {
  const res = await axios.post(`${baseUrl}/login`, credentials)
  return res.data
}

const register = async credentials => {
  const res = await axios.post(`${baseUrl}/register`, credentials)
  return res.data
}

export default { login, register }