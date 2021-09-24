import axios from 'axios'
const baseUrl = '/api/user'

const getToken = () => {
    return JSON.parse(localStorage.getItem('tokens'))
}

const login = async credentials => {
    const res = await axios.post(`${baseUrl}/login`, credentials)
    return res.data
}

const register = async credentials => {
    const res = await axios.post(`${baseUrl}/register`, credentials)
    return res.data
}

const checkProfileOwnership = (profile_id) => {
    const token = getToken()
    const decodedToken = token ? JSON.parse(window.atob(token.token.split('.')[1])) : null
    return decodedToken ? decodedToken.id === profile_id : false
}

const profile = async (username) => {
    const tokenObj = getToken()
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

const progress = async (progress) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/progress`, progress, config)
    return res.data
}

const saveEpisode = async (episode) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/save_episode`, episode, config)
}

const search = async (searchObj) => {
    const res = await axios.post(`${baseUrl}/search`, searchObj)
    return res.data
}

const discover = async () => {
    const tokenObj = getToken()
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

const discoverScroll = async (startIndex, type) => {
    const tokenObj = getToken()
    let config = {}
    // if user is logged in, send their token with the request
    if (tokenObj) {
        const token = `bearer ${tokenObj.token}`
        config = {
            headers: { Authorization: token }
        }
    }
    const res = await axios.post(`${baseUrl}/discover/scroll`, { startIndex, type }, config)
    return res.data
}

const followUser = async (userToFollow, follow) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/follow`, { userToFollow, follow }, config)
    return res.data
}

const getActivities = async () => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/activity`, undefined, config)
    return res.data
}

const saveSettings = async (settings) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/save_settings`, settings, config)
    return res.data
}

const getSettings = async () => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/get_settings`, undefined, config)
    return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login, register, profile, progress, search, discover, discoverScroll, followUser, getActivities, saveSettings, getSettings, checkProfileOwnership, saveEpisode }