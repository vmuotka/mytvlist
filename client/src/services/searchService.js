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


export default { search }