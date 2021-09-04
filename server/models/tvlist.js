const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tvlistSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    watching: {
        type: Boolean
    },
    score: {
        type: Number
    },
    listed: {
        type: Boolean
    },
    tv_id: {
        type: Number,
        required: true
    },
    progress: [],
    watch_progress: [{
        user: { type: Schema.Types.ObjectId, ref: 'Tvprogress' },
    }]
}, {
    timestamps: true,
})

tvlistSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
    }
})

const Tvlist = mongoose.model('Tvlist', tvlistSchema)

module.exports = Tvlist