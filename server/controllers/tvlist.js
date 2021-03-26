const tvlistRouter = require('express').Router()
const Tvlist = require('../models/tvlist')
const jwt = require('jsonwebtoken')

const handleActivity = require('../functions/activities').handleActivity

tvlistRouter.post('/addtolist', async (req, res) => {
  const tv_id = req.body.id
  const show_name = req.body.show_name

  let decodedToken
  if (req.token)
    decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  // check if the user has listed the show before
  const query = {
    user: decodedToken.id,
    tv_id
  }
  let findlist = []
  try {
    findlist = await Tvlist.find(query)
  } catch (err) {
    res.status(503).json({ error: 'Database connection failed' })
  }

  if (findlist.length === 0) {
    // if the user has not listed the show before, create a document to the database
    const tvlist = new Tvlist({
      user: decodedToken.id,
      tv_id,
      listed: true,
      watching: true,
      progress: [
        {
          season: 0,
          episode: 0
        }
      ]
    })
    handleActivity({
      user: decodedToken.id,
      desc: `added ${show_name} to their list.`
    })
    try {
      await tvlist.save()
    } catch (err) {
      res.status(503).json({ error: 'Database connection failed' })
    }
  } else {
    // if the user has listed the show before, change the shows following status instead
    findlist = findlist[0]
    findlist.listed = !findlist.listed
    try {
      await findlist.save()
    } catch (err) {
      res.status(503).json({ error: 'Database connection failed' })
    }

  }

  res.status(200).json({ message: 'success' })
})

module.exports = tvlistRouter