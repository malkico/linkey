const mongoose = require("mongoose")
const Schema = mongoose.Schema
const contactConf = require("./config/contactConf")


let ContactSchema = new Schema({
    which: {
        type: String,
        required: [true,"You must choose a contact information. And please contact us if you don't find your social media"],
        enum: {
            values : contactConf.which,
            message : "If you didn't find your contact information, you can choose other, and please contact us"
        }
    },
    URL: {
        type: String,
        // required: [true,"You can't add your social media without a username. Come on!"],
        required: [true,"This field is required"],
        minlength:  [3,'The field is shorter than the minimum allowed length (3)'],
        maxlength: [120,'The field is longer than the maximum allowed length (120)']
    }
})

ContactSchema.virtual("full_URL").get(function () {
    return contactConf.preURL[this.which]+this.URL
})

module.exports = mongoose.model("Contact", ContactSchema)