const mongoose = require("mongoose")
const Schema = mongoose.Schema

const emailStatusSchema = Schema({
    email : {
        type: String,
        required : [true,"models.errors.required"]
    }, 
    status : { 
        type: Boolean,
        default: false
    },
    date_added : {
        required : [true, "models.errors.generated_date"],
        type : Date,
        default : Date.now
    }

})

module.exports = mongoose.model("email_status",emailStatusSchema)