const mongoose = require('mongoose')

const tvprogressSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    tv_id: {
        type: Number,
        required: true
    },
    watch_time: {
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
                        type: Boolean,
                        required: true
                    },
                    watch_date: {
                        type: Date,
                        required: true
                    }
                }
            ]
        }
    ]
}, {
    timestamps: true,
})

tvprogressSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
    }
})

const Tvprogress = mongoose.model('Tvprogress', tvprogressSchema)

module.exports = Tvprogress