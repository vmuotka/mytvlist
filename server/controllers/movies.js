const moviesRouter = require('express').Router()
const axios = require('axios')
const axiosCache = require('axios-cache-adapter')
const jwt = require('jsonwebtoken')
const MovieList = require('../models/movielist')
const handleActivity = require('../functions/activities').handleActivity
const mongoose = require('mongoose')

// const countries = require('../static/countries.json')

const baseUrl = `https://api.themoviedb.org/3`

const cache = axiosCache.setupCache({
    maxAge: 60 * 60 * 1000
})

const api = axios.create({
    adapter: cache.adapter
})

moviesRouter.post('/search', async (req, res) => {
    const body = req.body
    let response
    try {
        response = await api(`${baseUrl}/search/movie?api_key=${process.env.MOVIEDB_API}&query=${body.searchword}&page=${body.page}`)
    } catch (err) {
        console.error(err)
        return res.status(503).json({ error: 'Server couln\'t connect to the API. Try again later.' })
    }

    let decodedToken
    if (req.token)
        decodedToken = jwt.verify(req.token, process.env.SECRET)

    let movielistArr
    if (decodedToken !== undefined) {
        movielistArr = await MovieList.find({ user: decodedToken.id })
    }



    const requests = response.data.results.map(result => api(`${baseUrl}/movie/${result.id}?api_key=${process.env.MOVIEDB_API}`))

    const results = await axios.all(requests)
        .then(axios.spread((...responses) => {
            let results = []
            responses.forEach((response) => {
                let movie = {}
                movie.info = response.data

                if (movielistArr && decodedToken) {
                    if (movielistArr.find(item => item.movie_id === movie.info.id)) {
                        movie.listed = movielistArr.find(item => item.movie_id === movie.info.id).listed
                    }
                } else {
                    movie.listed = false
                }

                results.push(movie)
            })
            return results
        }))

    return res.status(200).json({ results, total_results: response.data.total_results, total_pages: response.data.total_pages, searchword: body.searchword })
})

moviesRouter.post('/addtolist', async (req, res) => {
    const movie_id = req.body.id
    const title = req.body.title

    let decodedToken
    if (req.token)
        decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    // check if the user has listed the show before
    const query = {
        user: decodedToken.id,
        movie_id
    }
    let movie
    try {
        movie = await MovieList.findOne(query)
    } catch (err) {
        res.status(503).json({ error: 'Database connection failed' })
    }

    if (!movie) {
        // if the user has not listed the show before, create a document to the database
        movie = new MovieList({
            user: decodedToken.id,
            movie_id,
            listed: true,
            watch_times: []
        })
        handleActivity({
            user: decodedToken.id,
            desc: `added ${title} to their list.`
        })
        try {
            await movie.save()
        } catch (err) {
            res.status(503).json({ error: 'Database connection failed' })
        }
    } else {
        // if the user has listed the show before, change the shows following status instead
        movie.listed = !movie.listed
        try {
            await movie.save()
        } catch (err) {
            res.status(503).json({ error: 'Database connection failed' })
        }

    }

    res.status(200).json({ message: 'success' })
})

moviesRouter.post('/update_score', async (req, res) => {
    const body = req.body
    const decodedToken = decodeToken(req.token)
    let score = body.score
    if (score <= 0)
        score = undefined
    if (score > 100)
        score = 100

    if (decodedToken) {
        const movie = await MovieList.findOneAndUpdate({ user: decodedToken.id, movie_id: body.movie_id }, { score }, { new: true })
        res.status(200).json(movie)
    } else {
        res.status(500).json({ message: 'User has not logged in' })
    }

})

moviesRouter.post('/save_watchtime', async (req, res) => {
    const body = req.body
    const decodedToken = decodeToken(req.token)

    const watchtime = {
        _id: body.id,
        date: body.timestamp
    }

    console.log(body)

    if (decodedToken) {
        let movie = await MovieList.findOne({ user: decodedToken.id, movie_id: body.movie_id })
        if (movie.watch_times.find(item => item._id.toString() === body.id)) {
            console.log('ree')
            movie.watch_times = movie.watch_times.map(item => item._id.toString() === body.id ? watchtime : item)
        } else
            movie.watch_times.push(watchtime)

        await movie.save()
        res.status(200).json(movie)
    } else {
        res.status(500).json({ message: 'User has not logged in' })
    }
})

moviesRouter.post('/delete_watchtime', async (req, res) => {
    const body = req.body
    const decodedToken = decodeToken(req.token)

    if (decodedToken) {
        let movie = await MovieList.findOne({ user: decodedToken.id, movie_id: body.movie_id })
        let watch_times = [...movie.watch_times]
        watch_times = watch_times.filter(item => item._id.toString() !== body.id)

        movie.watch_times = watch_times
        movie.save()
        res.status(200).json(movie)
    } else {
        res.status(500).json({ message: 'User has not logged in' })
    }
})

const decodeToken = (token) => {
    if (token)
        return jwt.verify(token, process.env.SECRET)
    else
        return undefined
}

module.exports = moviesRouter