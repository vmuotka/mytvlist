import axios from 'axios'
const baseUrl = '/api/tv'


const search = async (searchObj, tokenObj) => {
  let config = {}
  // if user is logged in, send their token with the request
  if (tokenObj) {
    const token = `bearer ${tokenObj.token}`
    config = {
      headers: { Authorization: token }
    }
  }
  const res = await axios.post(`${baseUrl}/search`, searchObj, config)
  return res.data
}

const showPage = async (id, tokenObj) => {
  let config = {}
  // if user is logged in, send their token with the request
  if (tokenObj) {
    const token = `bearer ${tokenObj.token}`
    config = {
      headers: { Authorization: token }
    }
  }
  const res = await axios.post(`${baseUrl}/details`, { id }, config)
  return res.data
}

const getActorDetails = async (id) => {
  return axios.get(`${baseUrl}/actor/${id}`)
}

const saveReview = async (review, tokenObj) => {
  let config = {}
  const token = `bearer ${tokenObj.token}`
  config = {
    headers: { Authorization: token }
  }
  const res = await axios.post(`${baseUrl}/save_review`, review, config)
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { search, showPage, getActorDetails, saveReview }