const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SearchSchema = Schema({
    keyword : {
        type:String,
        required: true,
        min: 2,
        max: 40
    }
})

module.exports = mongoose.model("Serach",SearchSchema)