const mongoose = require("mongoose")
const Schema = mongoose.Schema
// const linkConf = require("./config/linkConf")
/*
const photo = {
    'Article' :  "article.png",
    'Video': "video.png",
    'Post/Story': '',
    'Creation': '',
    'Offer': '',
    'Announcement': '',
    'Tutorial': '',
    'Source code': '',
    'Promotional link': '',
    'Product': '',
    'Web page': ''
}
*/ 

let LinkSchema = new Schema({
    url: {
        type: String,
        required: [true, "models.required|@|URL"],
        minlength: [6,"models.minlength|@|URL|@|2"],
        maxlength: [180,"models.maxlength|@|URL|@|180"]
    },
    key:{
        type: Number,
        required: false,
        min: [100,"models.minlength|@|KEY|@|100"],
        max: [9999,"models.maxlength|@|KEY|@|9999"]
    },
    title: {
        type: String,
        required: [true, "models.required|@|title"],
        minlength: [3,"models.minlength|@|title|@|3"],
        maxlength: [120,"models.maxlength|@|title|@|120"]
    },
    description: {
        type: String,
        required: false,
        minlength: [5,"models.minlength|@|description|@|5"],
        maxlength: [160,"models.maxlength|@|description|@|160"]
    },
    photo : {
        type: String,
        required: false,
    },
    main: {
        type: Boolean,
        required: true
    },
    priority: {
        type: Number,
        required: false,
        min:  [1, "models.link.priority.min"],
        max: [9999, "models.link.priority.max"]
    },
    link_type : {
        type: String,
        /* required: [true,"If you didn't find the right type, you can choose Web page"], */
        required: false,
        /* enum : {
            values: linkConf.link_type,
            message : "If you didn't find the right type, you can choose Web page, and please contact us"
        } */
    },
    date_added: {
        type: Date,
        required: [true,'models.generated_date'],
        default: Date.now
    },
    date_modification: {
        type: Date,
        required: false,
    }

})

/* 
LinkSchema.virtual("type_photo").get(function(){
    return "icons/"+photo.get(this.link_type)
}) */

module.exports = mongoose.model("Link",LinkSchema)

