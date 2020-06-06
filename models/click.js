const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ClickSchema = Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,'models.required|@|follower'],
    },
    link: {
        type: Schema.Types.ObjectId,
        ref: 'Link',
        required: [true,'models.required|@|link'],
    },
    date: {
        type: Date,
        required: [true,'models.generated_date'],
        default : Date.now
    }
})

module.exports = mongoose.model("Click",ClickSchema)