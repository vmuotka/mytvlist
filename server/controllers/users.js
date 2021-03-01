const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const axiosCache = require('axios-cache-adapter')

// mongoose models
const User = require('../models/user')
const Tvlist = require('../models/tvlist')

const apiUrl = `https://api.themoviedb.org/3`

const cache = axiosCache.setupCache({
  maxAge: 60 * 60 * 1000
})

const api = axios.create({
  adapter: cache.adapter
})

const { body, validationResult } = require('express-validator')
usersRouter.post('/register', [
  body('username').trim().escape(),
  body('password').trim().escape(),
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array() })

  if (/^(?=.{3,20}$)[a-zA-Z0-9._-]$/.test(req.body.username))
    res.status(400).json({ error: 'Username is invalid' })

  const body = req.body
  const passwordHash = await bcrypt.hash(body.password, 10)

  const user = new User({
    username: body.username,
    passwordHash,
    email: body.email
  })

  let savedUser = null
  try {
    savedUser = await user.save()
  } catch (err) {
    return res.status(400).json({ error: err })
  }

  const userForToken = {
    username: savedUser.username,
    id: savedUser.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '7d' })

  return res.status(200).send({ token })
})

usersRouter.post('/login', [
  body('username').trim().escape(),
  body('password').trim().escape()
], async (req, res) => {
  const body = req.body
  let user
  try {
    user = await User.findOne({ username: { '$regex': `^${body.username}$`, $options: 'i' } })
  } catch (err) {
    return res.status(503).json({ error: 'Database connection failed' })
  }

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(passwordCorrect)) {
    return res.status(401).json({ error: 'Incorrect username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '28d' })

  return res.status(200).json({ token })
})

usersRouter.post('/profile', async (req, res) => {
  const username = req.body.username
  let user
  try {
    user = await User.findOne({ username: { '$regex': `^${username}$`, $options: 'i' } })
  } catch (err) {
    return res.status(503).json({ error: 'Database connection failed' })
  }

  if (!user)
    return res.status(404).json({ error: 'User not found' })


  let profile = JSON.parse(JSON.stringify(user))
  profile.email = undefined

  let tvlist
  try {
    tvlist = await Tvlist.find({ user: profile.id, listed: true })
  } catch (err) {
    return res.status(503).json({ error: 'Database connection failed' })
  }
  profile.tvlist = JSON.parse(JSON.stringify(tvlist))

  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  let tvlistArr
  if (decodedToken !== undefined)
    tvlistArr = await Tvlist.find({ user: decodedToken.id })

  const requests = profile.tvlist.map(item => api(`${apiUrl}/tv/${item.tv_id}?api_key=${process.env.MOVIEDB_API}`))

  axios.all(requests)
    .then(axios.spread((...responses) => {
      profile.tvlist.forEach((listItem, index) => {
        let show = responses[index].data
        show.seasons = show.seasons.filter(season => season.name !== 'Specials')

        if (tvlistArr) {
          if (tvlistArr.filter(item => item.tv_id === show.id).length > 0) {
            listItem.listed = tvlistArr.filter(item => item.tv_id === show.id)[0].listed
          }
        }

        listItem.tv_info = show
      })

      return res.status(200).json(profile)
    }))
})

usersRouter.post('/progress', async (req, res) => {
  const body = req.body
  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  let score = body.score
  if (score <= 0)
    score = undefined
  else if (score > 100)
    score = 100

  let progress = body.progress

  let show
  try {
    show = await api(`${apiUrl}/tv/${body.tv_id}?api_key=${process.env.MOVIEDB_API}`)
    show = show.data
  } catch (err) {
    return res.status(503).json({ error: 'There was an error. Try again later.' })
  }
  show.seasons = show.seasons.filter(season => season.name !== 'Specials')

  progress.forEach(obj => {
    if (obj.episode < 0) {
      obj.episode = 0
    }
    if (obj.season <= show.seasons.length && obj.season > 0) {
      // there might be a new season
      if (obj.season === show.seasons.length && obj.episode !== show.seasons[show.seasons.length - 1].episode_count) {
        obj.season = show.number_of_seasons - 1
      }

      if (obj.episode > show.seasons[obj.season - 1].episode_count) {
        obj.episode = show.seasons[obj.season - 1].episode_count - 1
      }
    } else if (obj.season === 0) {
      if (obj.episode > show.seasons[0].episode_count)
        obj.episode = show.seasons[0].episode_count - 1
    } else {
      return res.status(400).json({ error: 'Invalid progress given.' })
    }

  })
  try {
    await Tvlist.updateOne({ _id: body.id, user: decodedToken.id }, { $set: { progress: body.progress, watching: body.watching, score } })
  } catch (err) {
    return res.status(503).json({ error: 'Database connection failed' })
  }

  return res.status(200).json({ message: 'Progress saved successfully' })

})

usersRouter.post('/search', async (req, res) => {
  const body = req.body
  let users
  try {
    users = await User.find({ username: { $regex: body.username, $options: 'i' } })
  } catch (err) {
    res.status(503).json({ error: 'Connection to database failed' })
  }

  users = JSON.parse(JSON.stringify(users))

  for (let i = 0; i < users.length; i++) {
    try {
      const tvlist = await Tvlist.find({ user: users[i].id, listed: true })
      users[i].show_count = tvlist.length
    } catch (err) {
      res.status(503).json({ error: 'Connection to database failed' })
    }
  }
  return res.status(200).json({ results: users })

})

usersRouter.post('/discover', async (req, res) => {
  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  let date = new Date()
  date.setMonth(date.getMonth() - 6)
  date = date.toLocaleDateString('en-US').split('/')

  // API requires date string to have months and days with 2 numbers
  if (+date[0] < 10)
    date[0] = '0' + date[0]

  if (+date[1] < 10)
    date[1] = '0' + date[1]
  date = date[2] + '-' + date[0] + '-' + date[1]

  let discover = await api(`${apiUrl}/discover/tv?api_key=${process.env.MOVIEDB_API}&sort_by=popularity.desc&air_date.gte=${date}`)
  const discoverIdArr = discover.data.results.map(show => show.id)
  discover = await getDetails(discoverIdArr, decodedToken)

  const recommendationList = await getRecommendations(0, 4, decodedToken)

  return res.status(200).json({ discover, recommendationList })
})

usersRouter.post('/discover/scroll', async (req, res) => {
  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  const body = req.body

  const recommendationList = await getRecommendations(body.startIndex, body.endIndex, decodedToken)
  return res.status(200).json({ recommendationList })
})

const getRecommendations = async (startIndex, endIndex, decodedToken) => {
  let tvlist = await Tvlist.find({ user: decodedToken.id })
  tvlist.sort((a, b) => {
    if (!a.score && !b.score)
      return 0
    if (!a.score)
      return 1
    if (!b.score)
      return -1
    return b.score - a.score
  })
  tvlist = tvlist.slice(startIndex, endIndex)

  const tvshowIdArr = tvlist.map(show => show.tv_id)
  let recommendations = []
  const requests = tvshowIdArr.map(id => api(`${apiUrl}/tv/${id}/recommendations?api_key=${process.env.MOVIEDB_API}`))

  return axios.all(requests)
    .then(axios.spread(async (...responses) => {
      responses.forEach(response => {
        recommendations.push(response.data.results.slice(0, 4))
      })

      let recommendationDetails = []
      for (let i = 0; i < recommendations.length; i++) {
        let obj = {}
        const idArr = recommendations[i].map(show => show.id)
        // get the name of the show that the recommendations are for
        const tempArr = [tvlist[i].tv_id]
        const show = await getDetails(tempArr, decodedToken)
        obj.name = show[0].tv_info.name
        obj.recommendations = await getDetails(idArr, decodedToken)
        recommendationDetails.push(obj)
      }
      return recommendationDetails
    }))
}

const getDetails = async (showlist, decodedToken) => {
  let tvlistArr
  if (decodedToken !== undefined) {
    tvlistArr = await Tvlist.find({ user: decodedToken.id })
  }

  const requests = showlist.map(listItem => api(`${apiUrl}/tv/${listItem}?api_key=${process.env.MOVIEDB_API}`))
  return axios.all(requests)
    .then(axios.spread((...responses) => {
      let results = []
      showlist.forEach((listItem, index) => {
        let show = {}
        show.tv_info = responses[index].data

        if (show.tv_info.number_of_seasons > 0 && decodedToken.id) {
          if (tvlistArr) {
            if (tvlistArr.filter(item => item.tv_id === show.tv_info.id).length > 0) {
              show.listed = tvlistArr.filter(item => item.tv_id === show.tv_info.id)[0].listed
            }
          } else {
            show.listed = false
          }
          show.tv_id = show.tv_info.id
          results.push(show)
        }
      })
      return results
    }))
}

module.exports = usersRouter