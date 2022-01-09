import axios from 'axios'
const baseUrl = '/api/actor'


const search = async (searchObj) => {
    const res = await axios.post(`${baseUrl}/search`, searchObj)
    return res.data
}

const getDetails = async (id) => {
    return axios.get(`${baseUrl}/actor/${id}`)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { search, getDetails }