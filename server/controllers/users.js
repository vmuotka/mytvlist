const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

const { body, validationResult } = require('express-validator')
usersRouter.post('/register', [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('password').isLength({ min: 5 }).trim().escape(),
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

  return res.status(200).send(user)
})


module.exports = usersRouter