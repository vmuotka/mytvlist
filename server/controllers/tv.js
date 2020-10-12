const tvRouter = require('express').Router()
const axios = require('axios')
const Tvlist = require('../models/tvlist')
const jwt = require('jsonwebtoken')

const baseUrl = `https://api.themoviedb.org/3`

tvRouter.post('/search', async (req, res) => {
  const body = req.body
  const response = await axios.get(`${baseUrl}/search/tv?api_key=${process.env.MOVIEDB_API}&query=${body.searchword}`)

  // return array of shows the user is following
  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  let tvlistArr
  if (decodedToken !== undefined)
    tvlistArr = await Tvlist.find({ user: decodedToken.id })

  let results = []
  for (let i = 0; i < response.data.results.length && i < 5; i++) {
    let show = await axios.get(`${baseUrl}/tv/${response.data.results[i].id}?api_key=${process.env.MOVIEDB_API}`)
    if (show.data.number_of_seasons > 0) {
      if (tvlistArr) {
        if (tvlistArr.filter(item => item.tv_id === show.data.id).length > 0) {
          show.data.following = tvlistArr.filter(item => item.tv_id === show.data.id)[0].following
        }
      } else {
        show.data.following = false
      }
      results.push(show.data)
    }
  }

  return res.status(200).json({ results, total_results: response.data.total_results, total_pages: response.data.total_pages })
})

module.exports = tvRouter