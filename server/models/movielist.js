const mongoose = require('mongoose')

const movielistSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    score: {
        type: Number
    },
    listed: {
        type: Boolean
    },
    movie_id: {
        type: Number,
        required: true
    },
    watch_times: [
        {
            // timestamps, when the movie was watched
            type: String
        }
    ]
}, {
    timestamps: true,
})

movielistSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
    }
})

const Movielist = mongoose.model('Movielist', movielistSchema)

module.exports = Movielist