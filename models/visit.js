const mongoose = require("mongoose")
const Schema = mongoose.Schema

const VisitSchema = new Schema({
    follower : {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,'The follower id is required'],
    },
    influencer : {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: [true,'The influencer id is required'],
    },
    date: {
        type : Date,
        default: Date.now,
        required: [true,'An error was generated when assigning a registration date, please check the date and time on your device.'],
    }
})

module.exports = mongoose.model("Visit",VisitSchema)