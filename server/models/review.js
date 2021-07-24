const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    spoilers: {
        type: Boolean,
    },
    recommended: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tv_id: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true,
        autopopulate: true
    },
}, { timestamps: true })

reviewSchema.plugin(require('mongoose-autopopulate'))

reviewSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review