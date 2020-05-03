/* const mongoose = require("mongoose")
const Schema = mongoose.Schema
const iconesFolder = "/images/"

const LinkTypeSchema = new Schema({
    photo :{
        type: String,
        required: true,
        enum :[
            "video.png", "article.png"
        ],
        get : v => "${iconesFolder}${v}"

    }
})
*/