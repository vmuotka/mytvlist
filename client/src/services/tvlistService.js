import axios from 'axios'
const baseUrl = '/api/tvlist'

const addToList = async (showid, tokenObj) => {
  const token = `bearer ${tokenObj.token}`
  const config = {
    headers: { Authorization: token }
  }
  const res = await axios.post(`${baseUrl}/addtolist`, showid, config)
  return res.data
}


export default { addToList }