const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')

// mongoose models
const User = require('../models/user')
const Tvlist = require('../models/tvlist')
const Tvshow = require('../models/tvshow')

const apiUrl = `https://api.themoviedb.org/3`

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

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '7d' })

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

  const tvshowIdArr = profile.tvlist.map(show => show.tv_id)

  let showsOnDb
  try {
    showsOnDb = await Tvshow.find({ 'tv_id': { $in: tvshowIdArr } })
  } catch (err) {
    return res.status(503).json({ error: 'Database connection failed' })
  }

  for (let i = 0; i < profile.tvlist.length; i++) {
    profile.tvlist[i].listed = false
    let show
    if (showsOnDb.some(show => show.tv_id === profile.tvlist[i].tv_id)) {
      show = showsOnDb.find(show => show.tv_id === profile.tvlist[i].tv_id).show
    } else {
      try {
        show = await axios.get(`${apiUrl}/tv/${profile.tvlist[i].tv_id}?api_key=${process.env.MOVIEDB_API}`)
      } catch (err) {
        return res.status(503).json({ error: 'MovieDbAPI connection failed' })
      }

      show = show.data
      const showToDb = new Tvshow({ tv_id: show.id, show })
      showToDb.save()
    }
    if (tvlistArr) {
      if (tvlistArr.filter(item => item.tv_id === show.id).length > 0) {
        profile.tvlist[i].listed = tvlistArr.filter(item => item.tv_id === show.id)[0].listed
      }
    }
    show.seasons = show.seasons.filter(season => season.name !== 'Specials')
    profile.tvlist[i].tv_info = show
  }
  return res.status(200).json(profile)
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
  if (+date[0] < 10)
    date[0] = '0' + date[0]
  date = date[2] + '-' + date[0] + '-' + date[1]
  let discover = await axios.get(`${apiUrl}/discover/tv?api_key=${process.env.MOVIEDB_API}&sort_by=popularity.desc&air_date.gte=${date}`)
  discover = await getDetails(discover.data.results, decodedToken)
  return res.status(200).json({ discover })
})

const getDetails = async (showlist, decodedToken) => {
  let tvlistArr
  if (decodedToken !== undefined) {
    tvlistArr = await Tvlist.find({ user: decodedToken.id })
  }

  const tvshowIdArr = showlist.map(show => show.id)

  let showsOnDb = []
  try {
    showsOnDb = await Tvshow.find({ 'tv_id': { $in: tvshowIdArr } })
  } catch (err) {
    // if this response results in an error, the code can get the needed info from the api
    console.error(err)
  }

  let results = []
  for (let i = 0; i < showlist.length; i++) {
    let show = {}
    if (showsOnDb.some(show => show.tv_id === showlist[i].id)) {
      show.tv_info = showsOnDb.find(show => show.tv_id === showlist[i].id).show
    } else {
      try {
        show.tv_info = await axios.get(`${apiUrl}/tv/${showlist[i].id}?api_key=${process.env.MOVIEDB_API}`)
      } catch (err) {
        // return res.status(503).json({ error: 'Server couln\'t connect to the API. Try again later.' })
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
      show.tv_id = show.tv_info.id
      results.push(show)
    }
  }
  return results
}

module.exports = usersRouter