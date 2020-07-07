const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubscriptionModel = new Schema({
    follower:{
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,"models.subscription.follower.required"],
    },
    influencer: {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: [true,"models.subscription.influencer.required"],
    }
})

module.exports = mongoose.model("Subscription",SubscriptionModel);