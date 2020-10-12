const mongoose = require('mongoose')

const tvlistSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  following: {
    type: Boolean
  },
  tv_id: {
    type: Number,
    required: true
  },
  seasons: [
    {
      season_id: {
        type: Number,
        required: true
      },
      episodes: [
        {
          episode_id: {
            type: Number,
            required: true
          },
          watched: {
            type: Boolean
          }
        }
      ]
    }
  ]
})

tvlistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

const Tvlist = mongoose.model('Tvlist', tvlistSchema)

module.exports = Tvlist