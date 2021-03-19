const tvRouter = require('express').Router()
const axios = require('axios')
const Tvlist = require('../models/tvlist')
const jwt = require('jsonwebtoken')
const axiosCache = require('axios-cache-adapter')

const countries = require('../static/countries.json')

const cache = axiosCache.setupCache({
  maxAge: 60 * 60 * 1000
})

const api = axios.create({
  adapter: cache.adapter
})

const baseUrl = `https://api.themoviedb.org/3`

tvRouter.post('/search', async (req, res) => {
  const body = req.body
  let response
  try {
    response = await api(`${baseUrl}/search/tv?api_key=${process.env.MOVIEDB_API}&query=${body.searchword}&page=${body.page}`)
  } catch (err) {
    return res.status(503).json({ error: 'Server couln\'t connect to the API. Try again later.' })
  }

  // return array of shows the user is following
  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  let tvlistArr
  if (decodedToken !== undefined) {
    tvlistArr = await Tvlist.find({ user: decodedToken.id })
  }

  const requests = response.data.results.map(result => api(`${baseUrl}/tv/${result.id}?api_key=${process.env.MOVIEDB_API}`))

  const results = await axios.all(requests)
    .then(axios.spread((...responses) => {
      let results = []
      responses.forEach((response) => {
        let show = {}
        show.tv_info = response.data
        show.tv_info.seasons = show.tv_info.seasons.filter(season => season.name !== 'Specials')

        if (tvlistArr && decodedToken) {
          if (tvlistArr.filter(item => item.tv_id === show.tv_id).length > 0) {
            show.listed = tvlistArr.filter(item => item.tv_id === show.tv_info.id)[0].listed
          }
        } else {
          show.listed = false
        }

        results.push(show)
      })
      return results
    }))

  return res.status(200).json({ results, total_results: response.data.total_results, total_pages: response.data.total_pages, searchword: body.searchword })
})

tvRouter.post('/details', async (req, res) => {
  const body = req.body
  let response
  try {
    response = await api(`${baseUrl}/tv/${body.id}?api_key=${process.env.MOVIEDB_API}&append_to_response=aggregate_credits`)
  } catch (err) {
    return res.status(503).json({ error: 'Server couln\'t connect to the API. Try again later.' })
  }

  response = response.data
  let providers
  try {
    providers = await api(`${baseUrl}/tv/${body.id}/watch/providers?api_key=${process.env.MOVIEDB_API}`)
    response.providers = providers.data.results
    Object.entries(response.providers).forEach(([key, value]) => {
      response.providers[key].name = countries.find(country => country.code.toLowerCase() === key.toLowerCase()).name
    })
  } catch (err) {
    response.providers = {}
  }

  const requests = response.seasons.map(season => api(`${baseUrl}/tv/${body.id}/season/${season.season_number}?api_key=${process.env.MOVIEDB_API}`))

  axios.all(requests)
    .then(axios.spread(async (...responses) => {
      response.seasons.forEach((season, index) => {
        response.seasons[index] = responses[index].data
      })
      // return array of shows the user is following
      let decodedToken
      if (req.token)
        decodedToken = jwt.verify(req.token, process.env.SECRET)

      let tvlistItem
      if (decodedToken !== undefined) {
        tvlistItem = await Tvlist.find({ user: decodedToken.id, tv_id: body.id })
        tvlistItem = tvlistItem[0]
        response.listed = tvlistItem ? tvlistItem.listed : false
      }

      return res.status(200).json(response)
    }))
})

module.exports = tvRouter