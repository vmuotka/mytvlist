const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
                { type: Schema.Types.ObjectId, ref: 'Episode' }
            ]
        }
    ]
}, {
    timestamps: true,
})

userSchema.plugin(require('mongoose-autopopulate'))

tvprogressSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
    }
})

const Tvprogress = mongoose.model('Tvprogress', tvprogressSchema)

module.exports = Tvprogress