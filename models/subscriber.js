const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubscriberSchema = new Schema({
    first_name: {
        type: String,
        required: [true,'The first name is required'],
        minlength:  [2,'The first name is shorter than the minimum allowed length (2)'],
        maxlength: [50,'The first name is longer than the maximum allowed length (50)']
    },
    email: {
        type: String,
        required: [true,'The email is required'],
        minlength: [8,'The email is shorter than the minimum allowed length (8)'],
        maxlength:  [50,'The email is longer than the maximum allowed length (50)'],
        unique: 'This email is already taken',
    }

})

SubscriberSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Subscriber", SubscriberSchema)