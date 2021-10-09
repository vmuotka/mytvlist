const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tvprogressSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    tvlist_id: {
        type: String,
        required: true
    }
    ,
    tv_id: {
        type: Number,
        required: true
    },
    // watch_time: {
    //     type: Number,
    //     required: true
    // },
    episodes: [
        { type: Schema.Types.ObjectId, ref: 'Episode', autopopulate: true },
    ]
}, {
    timestamps: true,
})

tvprogressSchema.plugin(require('mongoose-autopopulate'))

tvprogressSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
    }
})

const Tvprogress = mongoose.model('Tvprogress', tvprogressSchema)

module.exports = Tvprogress