const actorRouter = require('express').Router()
const axios = require('axios')
const Tvlist = require('../models/tvlist')
// const jwt = require('jsonwebtoken')
const axiosCache = require('axios-cache-adapter')
const MovieDbApi = require('../helpers/MovieDbApi')
const UserHelper = require('../helpers/UserHelper')

// const countries = require('../static/countries.json')

const cache = axiosCache.setupCache({
    maxAge: 60 * 60 * 1000
})

const api = axios.create({
    adapter: cache.adapter
})

const baseUrl = `https://api.themoviedb.org/3`

actorRouter.post('/search', async (req, res) => {
    const body = req.body
    let response
    try {
        response = await api(`${baseUrl}/search/person?api_key=${process.env.MOVIEDB_API}&query=${body.searchword}&page=${body.page}`)
    } catch (err) {
        return res.status(503).json({ error: 'Server couln\'t connect to the API. Try again later.' })
    }

    return res.status(200).json({ results: response.data.results, total_results: response.data.total_results, total_pages: response.data.total_pages, searchword: body.searchword })
})

actorRouter.get('/actor/:id', async (req, res) => {
    axios.get(`${baseUrl}/person/${req.params.id}?api_key=${process.env.MOVIEDB_API}&append_to_response=tv_credits,images,movie_credits`)
        .then(response => {
            res.status(200).json(response.data)
        })
        .catch(err => {
            res.status(500).json({ err })
        })
})

module.exports = actorRouter