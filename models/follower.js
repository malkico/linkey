const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FollowerSchema = Schema({
    ip_adress : {
        type: String,
        required: true,
        unique : "This ip adress is duplicated"
        /* minlength: 7,
        maxnlength: 15 */
    },
    subscriber: { 
        type: Schema.Types.ObjectId,
        ref: 'Subscriber',
        required: false
    }


})

FollowerSchema.plugin(require('mongoose-beautiful-unique-validation'))

module.exports = mongoose.model("Follower", FollowerSchema)