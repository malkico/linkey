const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ClickSchema = Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,'The follower id is required'],
    },
    link: {
        type: Schema.Types.ObjectId,
        ref: 'Link',
        required: [true,'The link id is required'],
    },
    date: {
        type: Date,
        required: [true,'An error was generated when assigning a registration date, please check the date and time on your device.'],
        default : Date.now
    }
})

module.exports = mongoose.model("Click",ClickSchema)