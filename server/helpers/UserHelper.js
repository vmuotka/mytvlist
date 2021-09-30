const jwt = require('jsonwebtoken')

// mongoose models
const User = require('../models/user')
const Tvlist = require('../models/tvlist')
const Movielist = require('../models/movielist')
const Activity = require('../models/activity')
const Review = require('../models/review')
const Episode = require('../models/episode')

const baseUrl = `https://api.themoviedb.org/3`
const MovieDbApi = require('../helpers/MovieDbApi')

const findById = async (id) => {
    const user = await User.findById(id)
    return user
}

const decodeToken = (token) => {
    if (token)
        return jwt.verify(token, process.env.SECRET)
    else
        return undefined
}

const getTvList = async (profile, decodedToken) => {
    let tvlist
    try {
        tvlist = await Tvlist.find({ user: profile.id, listed: true })
    } catch (err) {
        console.error(err)
        return res.status(503).json({ error: 'Database connection failed' })
    }

    tvlist = JSON.parse(JSON.stringify(tvlist))

    for (let list of tvlist) {
        list.watch_progress.sort((a, b) => {
            return a.watch_time - b.watch_time
        })
    }

    tvlist = await MovieDbApi.getTvDetailsWithProgress(tvlist, decodedToken)

    return tvlist
}

const getMovieList = async (profile, decodedToken) => {
    let movielist
    try {
        movielist = await Movielist.find({ user: profile.id, listed: true })
    } catch (err) {
        return res.status(503).json({ error: 'Database connection failed' })
    }
    movielist = JSON.parse(JSON.stringify(movielist))

    movielist = await MovieDbApi.getMovieDetailsWithProgress(movielist, decodedToken)

    return movielist
}

module.exports = {
    findById,
    decodeToken,
    getTvList,
    getMovieList
}