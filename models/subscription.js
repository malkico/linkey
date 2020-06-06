const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubscriptionModel = new Schema({
    follower:{
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,"models.required|@|follower id"],
    },
    influencer: {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: [true,"models.required|@|influencer id"],
    }
})

module.exports = mongoose.model("Subscription",SubscriptionModel);