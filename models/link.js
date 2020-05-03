const mongoose = require("mongoose")
const Schema = mongoose.Schema

const link_type = ['Article','Video','Post/Story','Creation','Offer','Announcement','Tutorial','Source code','Promotional link','Product','Web page']
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
    link: {
        type: String,
        required: true,
        min:6,
        max: 180
    },
    key:{
        type: Number,
        required: false,
        min : 100,
        max: 9999
    },
    title: {
        type: String,
        required: true,
        min: 3,
        max: 120
    },
    description: {
        type: String,
        required: false,
        min: 5,
        max: 160
    },
    photo : {
        type: String,
        required: false,
        min: 5,
        max: 28
    },
    main: {
        type: Boolean
    },
    priority: {
        type: Number,
        required: false,
        min: 1,
        max: 9999
    },
    link_type : {
        type: String,
        required: true,
        enum : link_type
    },
    date_added: {
        type: Date,
        required: true,
        default: Date.now
    },
    date_modification: {
        type: Date,
        required: true,
        default: Date.now
    }

})

LinkSchema.virtual("type_photo").get(function(){
    return "icons/"+photo.get(this.link_type)
})

// module.exports = mongoose.model("Link",LinkSchema)
exports.LinkSchema = mongoose.model("Link",LinkSchema)
exports.link_type = link_type

