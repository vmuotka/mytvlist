import axios from 'axios'
const baseUrl = '/api/tvlist'

const getToken = () => {
    return JSON.parse(localStorage.getItem('tokens'))
}

const addToList = async (showObj, tokenObj) => {
    const token = `bearer ${tokenObj.token}`
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/addtolist`, showObj, config)
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
    return res.data
}

const saveScore = async (score, tvlist_id) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/save_score`, { score, id: tvlist_id }, config)
    return res.data
}

const rewatch = async (watch_progress) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/rewatch`, watch_progress, config)
    return res.data
}

const deleteWatchtime = async (watch_progress) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/delete_watchtime`, watch_progress, config)
    return res.data
}

const saveWatching = async (watching, tv_id) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/save_watching`, { watching, tv_id }, config)
    return res.data
}

const pinShow = async (pinned, tv_id) => {
    const tokenObj = getToken()
    let config = {}
    const token = `bearer ${tokenObj.token}`
    config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/save_pinned`, { pinned, tv_id }, config)
    return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    addToList,
    saveEpisode,
    saveScore,
    rewatch,
    saveWatching,
    pinShow,
    deleteWatchtime
}