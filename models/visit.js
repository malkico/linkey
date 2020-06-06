const mongoose = require("mongoose")
const Schema = mongoose.Schema

const VisitSchema = new Schema({
    follower : {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,"models.required|@|follower id"],
    },
    influencer : {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: [true,"models.required|@|influencer id"],
    },
    date: {
        type : Date,
        default: Date.now,
        required: [true,'models.generated_date'],
    }
})

module.exports = mongoose.model("Visit",VisitSchema)