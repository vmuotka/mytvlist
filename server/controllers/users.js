const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Tvlist = require('../models/tvlist')
const axios = require('axios')

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
  const user = await User.findOne({ username: { '$regex': `^${body.username}$`, $options: 'i' } })
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
  try {
    const username = req.body.username
    const user = await User.findOne({ username: { '$regex': `^${username}$`, $options: 'i' } })

    let profile = JSON.parse(JSON.stringify(user))
    profile.email = undefined

    const tvlist = await Tvlist.find({ user: profile.id, following: true })
    profile.tvlist = JSON.parse(JSON.stringify(tvlist))

    let decodedToken
    if (req.token)
      decodedToken = jwt.verify(req.token, process.env.SECRET)

    let tvlistArr
    if (decodedToken !== undefined)
      tvlistArr = await Tvlist.find({ user: decodedToken.id })

    for (let i = 0; i < profile.tvlist.length; i++) {
      let show = await axios.get(`${apiUrl}/tv/${profile.tvlist[i].tv_id}?api_key=${process.env.MOVIEDB_API}`)
      if (tvlistArr) {
        if (tvlistArr.filter(item => item.tv_id === show.data.id).length > 0) {
          show.data.following = tvlistArr.filter(item => item.tv_id === show.data.id)[0].following
        }
      } else {
        show.data.following = false
      }
      show.data.seasons = show.data.seasons.filter(season => season.name !== 'Specials')
      profile.tvlist[i].tv_info = show.data
    }
    return res.status(200).json(profile)
  } catch (err) {
    return res.status(404).json({ error: 'User not found' })
  }
})

usersRouter.post('/progress', async (req, res) => {
  const body = req.body
  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  await Tvlist.updateOne({ _id: body.id }, { $set: { progress: body.progress } })
  return res.status(200).json({ message: 'ree' })

})

module.exports = usersRouter