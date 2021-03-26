const mongoose = require('mongoose')
const Schema = mongoose.Schema

const activitySchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true
  },
  tv_id: {
    type: Number
  },
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true,
    autopopulate: true
  },
}, { timestamps: true })

activitySchema.plugin(require('mongoose-autopopulate'))

activitySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity