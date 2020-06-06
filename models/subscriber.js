const mongoose = require("mongoose")
const Schema = mongoose.Schema
const SubscriberSchema = new Schema({
    first_name: {
        type: String,
        required: [true,"models.subscriber.first_name.required"],
        minlength: [2,"models.subscriber.first_name.minlength|@|2"],
        maxlength: [50,"models.subscriber.first_name.maxlength|@|50"]
    },
    email: {
        type: String,
        required: [true,"models.subscriber.email.required"],
        minlength: [8,"models.subscriber.email.minlength|@|8"],
        maxlength: [50,"models.subscriber.email.maxlength|@|50"],
        unique: "models.subscriber.email.unique",
    }

})

SubscriberSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Subscriber", SubscriberSchema)