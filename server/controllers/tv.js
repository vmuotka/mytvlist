const tvRouter = require('express').Router()
const axios = require('axios')
const Tvlist = require('../models/tvlist')
const Tvshow = require('../models/tvshow')
const jwt = require('jsonwebtoken')

const baseUrl = `https://api.themoviedb.org/3`

tvRouter.post('/search', async (req, res) => {
  const body = req.body
  const response = await axios.get(`${baseUrl}/search/tv?api_key=${process.env.MOVIEDB_API}&query=${body.searchword}&page=${body.page}`)

  // return array of shows the user is following
  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  let tvlistArr
  if (decodedToken !== undefined)
    tvlistArr = await Tvlist.find({ user: decodedToken.id })

  const tvshowIdArr = response.data.results.map(show => show.id)

  const showsOnDb = await Tvshow.find({ 'tv_id': { $in: tvshowIdArr } })

  let results = []
  for (let i = 0; i < response.data.results.length; i++) {
    let show
    if (showsOnDb.some(show => show.tv_id === response.data.results[i].id)) {
      show = showsOnDb.find(show => show.tv_id === response.data.results[i].id).show
    } else {
      show = await axios.get(`${baseUrl}/tv/${response.data.results[i].id}?api_key=${process.env.MOVIEDB_API}`)
      show = show.data
      const showToDb = new Tvshow({ tv_id: show.id, show })
      showToDb.save()
    }
    if (show.number_of_seasons > 0) {
      if (tvlistArr) {
        if (tvlistArr.filter(item => item.tv_id === show.id).length > 0) {
          show.listed = tvlistArr.filter(item => item.tv_id === show.id)[0].listed
        }
      } else {
        show.listed = false
      }
      results.push(show)
    }
  }

  return res.status(200).json({ results, total_results: response.data.total_results, total_pages: response.data.total_pages, searchword: body.searchword })
})

module.exports = tvRouter