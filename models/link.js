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
    URL: {
        type: String,
        required: [true, "models.link.URL.required"],
        minlength: [2,"models.link.URL.minlength|@|2"],
        maxlength: [720,"models.link.URL.maxlength|@|720"]
    },
    KEY:{
        type: Number,
        required: false,
        min: [100,"models.link.KEY.min|@|100"],
        max: [9999,"models.link.KEY.max|@|9999"]
    },
    title: {
        type: String,
        required: [true, "models.link.title.required"],
        minlength: [3,"models.link.title.minlength|@|3"],
        maxlength: [120,"models.link.title.maxlength|@|120"]
    },
    description: {
        type: String,
        required: false,
        minlength: [5,"models.link.description.minlength|@|5"],
        maxlength: [160,"models.link.description.maxlength|@|160"]
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
        min: [1,"models.link.priority.min|@|1"],
        max: [9999,"models.link.priority.max|@|9999"]
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
        required: [true,'models.errors.generated_date'],
        default: Date.now
    },
    date_modification: {
        type: Date,
        required: [true,'models.errors.generated_date'],
        default: Date.now
    }

})

/* 
LinkSchema.virtual("type_photo").get(function(){
    return "icons/"+photo.get(this.link_type)
}) */

module.exports = mongoose.model("Link",LinkSchema)

