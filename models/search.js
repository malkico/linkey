const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SearchSchema = Schema({
    follower: {
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
        type: Date,
        required: [true,'An error was generated when assigning a registration date, please check the date and time on your device.'],
        default : Date.now
    } ,
    keyword : {
        type:String,
        required: [true,"We can't help you without knowing what you're looking for"],
        maxlength: [80,'The keyword is longer than the maximum allowed length (80)']
    },
    clicks:[{
        type: Schema.Types.ObjectId,
        ref: 'Click',
        required: false
    }]
})

module.exports = mongoose.model("Search",SearchSchema)