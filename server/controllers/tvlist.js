const tvlistRouter = require('express').Router()
const Tvlist = require('../models/tvlist')
const jwt = require('jsonwebtoken')

tvlistRouter.post('/addtolist', async (req, res) => {
  const tv_id = req.body.id

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

  let findlist = await Tvlist.find(query)
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
    await tvlist.save()
  } else {
    // if the user has listed the show before, change the shows following status instead
    findlist = findlist[0]
    findlist.listed = !findlist.listed
    await findlist.save()
  }

  res.status(200).json({ message: 'success' })
})

module.exports = tvlistRouter