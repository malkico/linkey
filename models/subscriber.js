const mongoose = require("mongoose")
const Schema = mongoose.Schema7

const SubscriberSchema = new Schema({
    mail: {
        type: String,
        required: true,
        unique,
        min: 8,
        max: 50
    },
    first_name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    }

})

module.exports = mongoose.model("Subscriber", SubscriberSchema)