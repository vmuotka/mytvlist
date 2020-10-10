const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const { body, validationResult } = require('express-validator')
usersRouter.post('/register', [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('password').isLength({ min: 5 }).trim().escape(),
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const body = req.body
  const passwordHash = await bcrypt.hash(body.password, 10)

  const user = {
    username: body.username,
    password: passwordHash,
    email: body.email
  }

  console.log(user)
  return res.status(200).send(user)
})


module.exports = usersRouter