import axios from 'axios'
const baseUrl = '/api/movie'

const getToken = () => {
    return JSON.parse(localStorage.getItem('tokens'))
}


const search = async (searchObj) => {
    const tokenObj = getToken()
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

const addToList = async (obj) => {
    const tokenObj = getToken()
    const token = `bearer ${tokenObj.token}`
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/addtolist`, obj, config)
    return res.data
}

const updateScore = async (obj) => {
    const tokenObj = getToken()
    const token = `bearer ${tokenObj.token}`
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/update_score`, obj, config)
    return res.data
}

const showPage = async (id) => {
    const tokenObj = getToken()
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

const saveReview = async (review) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/save_review`, review, config)
    return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { search, showPage, getActorDetails, saveReview, addToList, updateScore }