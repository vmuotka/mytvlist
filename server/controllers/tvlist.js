const tvlistRouter = require('express').Router()
const Tvlist = require('../models/tvlist')
const jwt = require('jsonwebtoken')

tvlistRouter.post('/addtolist', async (req, res) => {
  const tv_id = req.body.id

  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  // check if the user has listed the show before
  const query = {
    user: decodedToken.id,
    tv_id
  }

  let findlist = await Tvlist.findOne(query)
  if (findlist.length === 0) {
    // if the user has not listed the show before, create a document to the database
    const tvlist = new Tvlist({
      user: decodedToken.id,
      tv_id,
      following: true
    })
    await tvlist.save()
  } else {
    // if the user has listed the show before, change the shows following status instead
    console.log(findlist)
    findlist.following = !findlist.following
    await findlist.save()
  }

  res.status(200)
})

module.exports = tvlistRouter