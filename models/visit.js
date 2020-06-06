const mongoose = require("mongoose")
const Schema = mongoose.Schema

const VisitSchema = new Schema({
    follower : {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,"models.visit.follower.required"],
    },
    influencer : {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: [true,"models.visit.influencer.required"],
    },
    date: {
        type : Date,
        default: Date.now,
        required: [true,'models.errors.generated_date'],
    }
})

module.exports = mongoose.model("Visit",VisitSchema)