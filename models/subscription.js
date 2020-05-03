const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubscriptionModel = new Schema({
    follower:{
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: true
    },
    influencer: {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: true
    }
})

module.exports = mongoose.model("Subscription",SubscriptionModel);