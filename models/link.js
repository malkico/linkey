const mongoose = require("mongoose")
const Schema = mongoose.Schema
const linkConf = require("./config/linkConf")

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

let LinkSchema = new Schema({
    url: {
        type: String,
        required: [true, "The URL is required"],
        minlength:  [6,'The URL is shorter than the minimum allowed length (6)'],
        maxlength: [180,'The URL is longer than the maximum allowed length (180)']
    },
    key:{
        type: Number,
        required: false,
        min:  [100,'The KEY is shorter than the minimum allowed length (3)'],
        max: [9999,'The KEY is longer than the maximum allowed length (4)']
    },
    title: {
        type: String,
        required: [true,'The title is required'],
        minlength:  [3,'The title is shorter than the minimum allowed length (3)'],
        maxlength: [120,'The title is longer than the maximum allowed length (120)']
    },
    description: {
        type: String,
        required: false,
        minlength:  [5,'The description is shorter than the minimum allowed length (5)'],
        maxlength: [160,'The description is longer than the maximum allowed length (160)']
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
        min:  [1,'Please enter a valid priority'],
        max: [9999,'Priority cannot be more than 9999']
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
        required: [true,'An error was generated when assigning a registration date, please check the date and time on your device.'],
        default: Date.now
    },
    date_modification: {
        type: Date,
        required: false,
    }

})

LinkSchema.virtual("type_photo").get(function(){
    return "icons/"+photo.get(this.link_type)
})

module.exports = mongoose.model("Link",LinkSchema)

