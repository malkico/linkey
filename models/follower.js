const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FollowerSchema = Schema({
    ip_adress : {
        type: String,
        required: true,
        min: 7,
        max: 15
    },
    session : {
        type: String,
        required: true,
        max: 80
    },
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: 'Subscriber',
        required: false
    }


})

module.exports = mongoose.Model("Follower", FollowerSchema)