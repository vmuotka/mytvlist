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

const profile = async (username, tokenObj) => {
  let config = {}
  // if user is logged in, send their token with the request
  if (tokenObj) {
    const token = `bearer ${tokenObj.token}`
    config = {
      headers: { Authorization: token }
    }
  }
  const res = await axios.post(`${baseUrl}/profile`, { username }, config)
  return res.data
}

const progress = async (progress, tokenObj) => {
  let config = {}
  const token = `bearer ${tokenObj.token}`
  config = {
    headers: { Authorization: token }
  }
  const res = await axios.post(`${baseUrl}/progress`, progress, config)
  return res.data

}

export default { login, register, profile, progress }