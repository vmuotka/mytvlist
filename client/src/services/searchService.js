import axios from 'axios'
const baseUrl = '/api/tv'


const search = async (searchObj) => {
  const res = await axios.post(`${baseUrl}/search`, searchObj)
  return res.data
}


export default { search }