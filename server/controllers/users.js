const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const axiosCache = require('axios-cache-adapter')

// mongoose models
const User = require('../models/user')
const Tvlist = require('../models/tvlist')
const Activity = require('../models/activity')
const Review = require('../models/review')

const handleActivity = require('../functions/activities').handleActivity
const validateProgress = require('../utils/progress-validation').validateProgress

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

usersRouter.post('/save_settings', async (req, res) => {
  const body = req.body
  const decodedToken = decodeToken(req.token)

  let messages = []

  let user
  try {
    user = await User.findByIdAndUpdate(decodedToken.id, { quote: body.quote })
  } catch (err) {
    res.status(503).json({ error: 'Connection to database failed' })
  }

  if (body.new_password) {
    let user
    try {
      user = await User.findById(decodedToken.id)
    } catch (err) {
      return res.status(503).json({ error: 'Database connection failed' })
    }

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(body.new_password.old_password, user.passwordHash)

    if (passwordCorrect) {
      const passwordHash = await bcrypt.hash(body.new_password.value, 10)
      await User.findByIdAndUpdate(decodedToken.id, { passwordHash: passwordHash })
      messages.push({ title: 'Password changed', message: '' })
    } else {
      messages.push({ title: 'Password change failed', message: 'Old password was wrong', type: 'error' })
    }
  }
  messages.push({ title: 'Settings saved' })

  return res.status(200).json(messages)
})

usersRouter.post('/get_settings', async (req, res) => {
  const decodedToken = decodeToken(req.token)
  let user
  try {
    user = await User.findById(decodedToken.id)
  } catch (err) {
    res.status(503).json({ error: 'Connection to database failed' })
  }
  return res.status(200).json(user)
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

  profile.followed = false
  if (decodedToken && decodedToken.id !== user.id) {
    const tokenUser = await User.findOne({ _id: decodedToken.id })
    if (tokenUser.following && tokenUser.following.includes(user.id))
      profile.followed = true
  }

  profile.activity = await Activity.find({ user: profile.id })
  profile.reviews = await Review.find({ user: profile.id })

  profile.activity.sort((a, b) => {
    return b.updatedAt - a.updatedAt
  })

  profile.following = await User.find({ _id: profile.following })

  profile.following = users = JSON.parse(JSON.stringify(profile.following))

  profile.following.forEach(async (user) => {
    user.tvlist = await Tvlist.find({ user: user.id })
    user.show_count = user.tvlist.length
  })

  let tvlistArr
  if (decodedToken !== undefined)
    tvlistArr = await Tvlist.find({ user: decodedToken.id, listed: true })

  const requests = profile.tvlist.map(item => api(`${apiUrl}/tv/${item.tv_id}?api_key=${process.env.MOVIEDB_API}`))

  axios.all(requests)
    .then(axios.spread((...responses) => {
      profile.tvlist.forEach((listItem, index) => {
        let show = responses[index].data
        show.seasons = show.seasons.filter(season => season.name !== 'Specials' && season.episode_count > 0)

        if (tvlistArr) {
          if (tvlistArr.filter(item => item.tv_id === show.id).length > 0) {
            listItem.listed = true
          } else {
            listItem.listed = false
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
    obj = validateProgress(obj, show)
  })

  if (progress[progress.length - 1].season === show.number_of_seasons && progress[progress.length - 1].episode === show.seasons[show.seasons.length - 1].episode_count) {
    handleActivity({
      user: decodedToken.id,
      desc: `finished ${show.name}`
    })
  }

  try {
    let tvlist = await Tvlist.findOne({ _id: body.id, user: decodedToken.id })
    if (progress.length > tvlist.progress.length) {
      handleActivity({
        desc: `started rewatching ${show.name}.`,
        user: decodedToken.id
      })
    }

    handleActivity({
      tv_id: body.tv_id,
      desc: `watched ${show.name}: Season ${Math.min(progress[progress.length - 1].season + 1, show.number_of_seasons)} Episode ${progress[progress.length - 1].episode}.`,
      user: decodedToken.id
    })

    tvlist.progress = progress
    tvlist.watching = body.watching
    tvlist.score = body.score
    await tvlist.save()

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

  const recommendationList = await getRecommendations(0, 6, decodedToken)

  return res.status(200).json({ discover, recommendationList })
})

usersRouter.post('/discover/scroll', async (req, res) => {
  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  const body = req.body

  const recommendationList = await getRecommendations(body.startIndex, body.startIndex + 8, decodedToken)
  return res.status(200).json({ recommendationList })
})

usersRouter.post('/follow', async (req, res) => {
  const decodedToken = decodeToken(req.token)

  const body = req.body

  let user = await User.findOne({ _id: decodedToken.id })

  if (body.follow)
    user.following.push(body.userToFollow.id)
  else
    user.following = user.following.filter(id => body.userToFollow.id !== id)

  user.save()

  if (body.follow) {
    handleActivity({
      user: decodedToken.id,
      desc: `started following ${body.userToFollow.username}.`
    })
  }

  return res.status(200).json(user)
})

usersRouter.post('/activity', async (req, res) => {
  const decodedToken = decodeToken(req.token)
  const user = await User.findOne({ _id: decodedToken.id })
  const activities = await Activity.find({
    user: user.following,
    updatedAt: {
      $gte: new Date(new Date() - 28 * 60 * 60 * 24 * 1000)
    }
  })
  activities.sort((a, b) => {
    return b.updatedAt - a.updatedAt
  })
  const following = await User.find({ _id: user.following }).select('username')
  return res.status(200).json({ activities, following })
})



const decodeToken = (token) => {
  return jwt.verify(token, process.env.SECRET)
}

const getRecommendations = async (startIndex, endIndex, decodedToken) => {
  let tvlist = await Tvlist.find({ user: decodedToken.id })
  tvlist.sort((a, b) => {
    if (!a.score && !b.score)
      return 0
    if (!a.score)
      return 1
    if (!b.score)
      return -1
    calculateScoreValue(b)
    return calculateScoreValue(b) - calculateScoreValue(a)
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
        // if (recommendations[i].length > 0) {
        let obj = {}
        const idArr = recommendations[i].map(show => show.id)
        // get the name of the show that the recommendations are for
        const tempArr = [tvlist[i].tv_id]
        const show = await getDetails(tempArr, decodedToken)
        obj.name = show[0].tv_info.name
        obj.recommendations = await getDetails(idArr, decodedToken)
        recommendationDetails.push(obj)
        // }
      }
      return recommendationDetails
    }))
}

const calculateScoreValue = (show) => {
  let last_watched_modifier = 1
  const modified_days_ago = Math.floor((new Date() - new Date(show.updatedAt)) / (24 * 60 * 60 * 1000))
  if (modified_days_ago <= 7)
    last_watched_modifier = 1
  else if (modified_days_ago <= 14)
    last_wathed_modifier = 0.95
  else if (modified_days_ago <= 21)
    last_watched_modifier = 0.9
  else if (modified_days_ago <= 28)
    last_watched_modifier = 0.85
  else
    last_watched_modifier = 0.8

  return last_watched_modifier * show.score
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