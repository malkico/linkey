const mongoose = require("mongoose")
const Schema = mongoose.Schema

const VisitSchema = new VisitSchema({
    date: {
        type : Date,
        default: Date.now,
        required: true
    },
    influencer : {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: true
    },
    follower : {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: true
    }
})

module.exports = mongoose.Model("Visit",VisitSchema)