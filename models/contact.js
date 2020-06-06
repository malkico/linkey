const mongoose = require("mongoose")
const Schema = mongoose.Schema
const contactConf = require("./config/contactConf")


let ContactSchema = new Schema({
    which: {
        type: String,
        required: [true,"models.contact.which.required"],
        enum: {
            values : Object.keys(contactConf.which),
            message : "models.contact.which.enum.message"
        }
    },
    URL: {
        type: String,
        // required: [true,"You can't add your social media without a username. Come on!"],
        required: [true,"models.contact.URL.required"],
        minlength: [3,"models.contact.URL.minlength|@|3"],
        maxlength: [120,"models.contact.URL.maxlength|@|120"]
    }
})

ContactSchema.virtual("full_URL").get(function () {
    let preURL = ""
    if(contactConf.preURL[this.which] !== "undefined")
        preURL = contactConf.preURL[this.which]
    return preURL+this.URL
})

ContactSchema.virtual("icone").get( function () {

    return contactConf.icone[this.which]
})

module.exports = mongoose.model("Contact", ContactSchema)