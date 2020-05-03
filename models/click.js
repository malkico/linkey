const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ClickSchema = Schema({
    date: {
        type: Date,
        required : true,
        default : Date.now
    } ,
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: true
    },
    Influencer: {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: true
    },
    search: {
        type: Schema.Types.ObjectId,
        ref: 'Search',
        required: false
    }
})

module.exports = mongoose.model("Click",ClickSchema)