const tvRouter = require('express').Router()
const axios = require('axios')

const baseUrl = `https://api.themoviedb.org/3`

tvRouter.post('/search', async (req, res) => {
  const body = req.body
  const response = await axios.get(`${baseUrl}/search/tv?api_key=${process.env.MOVIEDB_API}&query=${body.searchword}`)

  let results = []
  for (let i = 0; i < response.data.results.length && i < 5; i++) {
    const show = await axios.get(`${baseUrl}/tv/${response.data.results[i].id}?api_key=${process.env.MOVIEDB_API}`)
    if (show.data.number_of_seasons > 0)
      results.push(show.data)
  }

  return res.status(200).json({ results, total_results: response.data.total_results, total_pages: response.data.total_pages })
})

module.exports = tvRouter