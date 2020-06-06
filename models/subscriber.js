const mongoose = require("mongoose")
const Schema = mongoose.Schema
const SubscriberSchema = new Schema({
    first_name: {
        type: String,
        required: [true,"models.required|@|first name"],
        minlength: [2,"models.minlength|@|first name|@|2"],
        maxlength: [50,"models.maxlength|@|first name|@|50"]
    },
    email: {
        type: String,
        required: [true,"models.required|@|email"],
        minlength: [8,"models.minlength|@|email|@|8"],
        maxlength: [50,"models.maxlength|@|email|@|50"],
        unique: "models.unique_taken|@|email",
    }

})

SubscriberSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Subscriber", SubscriberSchema)