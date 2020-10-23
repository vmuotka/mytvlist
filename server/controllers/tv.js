const tvRouter = require('express').Router()
const axios = require('axios')
const Tvlist = require('../models/tvlist')
const Tvshow = require('../models/tvshow')
const jwt = require('jsonwebtoken')

const baseUrl = `https://api.themoviedb.org/3`

tvRouter.post('/search', async (req, res) => {
  const body = req.body
  let response
  try {
    response = await axios.get(`${baseUrl}/search/tv?api_key=${process.env.MOVIEDB_API}&query=${body.searchword}&page=${body.page}`)
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
  const tvshowIdArr = response.data.results.map(show => show.id)

  let showsOnDb = []
  try {
    showsOnDb = await Tvshow.find({ 'tv_id': { $in: tvshowIdArr } })
  } catch (err) {
    // if this response results in an error, the code can get the needed info from the api
    console.error(err)
  }


  let results = []
  for (let i = 0; i < response.data.results.length; i++) {
    let show = {}
    if (showsOnDb.some(show => show.tv_id === response.data.results[i].id)) {
      show.tv_info = showsOnDb.find(show => show.tv_id === response.data.results[i].id).show
    } else {
      try {
        show.tv_info = await axios.get(`${baseUrl}/tv/${response.data.results[i].id}?api_key=${process.env.MOVIEDB_API}`)
      } catch (err) {
        return res.status(503).json({ error: 'Server couln\'t connect to the API. Try again later.' })
      }
      show.tv_info = show.tv_info.data
      const showToDb = new Tvshow({ tv_id: show.tv_info.id, show: show.tv_info })
      showToDb.save()
    }
    if (show.tv_info.number_of_seasons > 0 && decodedToken.id) {
      if (tvlistArr) {
        if (tvlistArr.filter(item => item.tv_id === show.tv_info.id).length > 0) {
          show.listed = tvlistArr.filter(item => item.tv_id === show.tv_info.id)[0].listed
        }
      } else {
        show.listed = false
      }
      results.push(show)
    }
  }

  return res.status(200).json({ results, total_results: response.data.total_results, total_pages: response.data.total_pages, searchword: body.searchword })
})

tvRouter.get('/genres', async (req, res) => {
  let response
  try {
    response = await axios.get(`${baseUrl}/genre/tv/list?api_key=${process.env.MOVIEDB_API}`)
  } catch (err) {
    return res.status(503).json({ error: 'Server couln\'t connect to the API. Try again later.' })
  }
  res.status(200).json(response)
})


module.exports = tvRouter