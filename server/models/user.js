const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [3, 'Username is too short'],
    uniqueCaseInsensitive: true,
    required: [true, 'Username required'],
    unique: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password required']
  },
  email: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true,
    required: [true, 'Email required']
  },
  following: {
    type: Array,
    default: []
  },
  tvlist: [{
    user: { type: Schema.Types.ObjectId, ref: 'Tvlist' },
  }],
  quote: {
    value: String,
    character: String,
    source: String
  }
}, {
  timestamps: true,
})

userSchema.plugin(require('mongoose-autopopulate'))

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.email
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
    delete returnedObject.username_lower
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User