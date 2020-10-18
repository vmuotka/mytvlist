const mongoose = require('mongoose')

const tvshowSchema = new mongoose.Schema({
  tv_id: {
    type: Number,
    required: true
  },
  show: {}
}, { timestamps: true })

tvshowSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 86400 })

tvshowSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

const Tvshow = mongoose.model('Tvshow', tvshowSchema)

module.exports = Tvshow