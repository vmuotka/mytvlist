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

  if (req.body.username.indexOf(' ') >= 0)
    res.status(400).json({ error: 'Username should not contain spaces' })

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
        show.listed = tvlistArr.filter(item => item.tv_id === show.id)[0].listed
      }
    } else {
      show.listed = false
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

  try {
    await Tvlist.updateOne({ _id: body.id, user: decodedToken.id }, { $set: { progress: body.progress, watching: body.watching } })
  } catch (err) {
    return res.status(503).json({ error: 'Database connection failed' })
  }

  return res.status(200).json({ message: 'Progress saved successfully' })

})

module.exports = usersRouter