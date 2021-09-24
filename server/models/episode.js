const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    tvprogress_id: {
        type: String,
        required: true
    },
    episode_id: {
        type: Number,
        required: true
    },
    watched: {
        type: Boolean,
        required: true
    },
    watch_date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
})

schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
    }
})

const Episode = mongoose.model('Episode', schema)

module.exports = Episode