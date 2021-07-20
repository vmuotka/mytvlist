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

const search = async (searchObj) => {
  const res = await axios.post(`${baseUrl}/search`, searchObj)
  return res.data
}

const discover = async (tokenObj) => {
  let config = {}
  // if user is logged in, send their token with the request
  if (tokenObj) {
    const token = `bearer ${tokenObj.token}`
    config = {
      headers: { Authorization: token }
    }
  }
  const res = await axios.post(`${baseUrl}/discover`, {}, config)
  return res.data
}

const discoverScroll = async (startIndex, endIndex, tokenObj) => {
  let config = {}
  // if user is logged in, send their token with the request
  if (tokenObj) {
    const token = `bearer ${tokenObj.token}`
    config = {
      headers: { Authorization: token }
    }
  }
  const res = await axios.post(`${baseUrl}/discover/scroll`, { startIndex, endIndex }, config)
  return res.data
}

const followUser = async (userToFollow, follow, tokenObj) => {
  let config = {}
  const token = `bearer ${tokenObj.token}`
  config = {
    headers: { Authorization: token }
  }
  const res = await axios.post(`${baseUrl}/follow`, { userToFollow, follow }, config)
  return res.data
}

const getActivities = async (tokenObj) => {
  let config = {}
  const token = `bearer ${tokenObj.token}`
  config = {
    headers: { Authorization: token }
  }
  const res = await axios.post(`${baseUrl}/activity`, undefined, config)
  return res.data
}

const saveSettings = async (settings, tokenObj) => {
  let config = {}
  const token = `bearer ${tokenObj.token}`
  config = {
    headers: { Authorization: token }
  }
  const res = await axios.post(`${baseUrl}/save_settings`, settings, config)
  return res.data
}

const getSettings = async (tokenObj) => {
  let config = {}
  const token = `bearer ${tokenObj.token}`
  config = {
    headers: { Authorization: token }
  }
  const res = await axios.post(`${baseUrl}/get_settings`, undefined, config)
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login, register, profile, progress, search, discover, discoverScroll, followUser, getActivities, saveSettings, getSettings }