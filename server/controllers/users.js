const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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

  const token = jwt.sign(userForToken, process.env.SECRET)

  return res.status(200).send({ token })
})

usersRouter.post('/login', [
  body('username').trim().escape(),
  body('password').trim().escape()
], async (req, res) => {
  const body = req.body
  const user = await User.findOne({ username: new RegExp(body.username, 'i') })
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

module.exports = usersRouter