const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SearchSchema = Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,"models.influencer.follower.required"],
    },
    influencer : {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: [true,"models.influencer.influencer.required"],
    },
    date: {
        type: Date,
        required: [true,'models.errors.generated_date'],
        default : Date.now
    } ,
    keyword : {
        type:String,
        required: [true,"models.influencer.keyword.required"],
        maxlength: [80,"models.influencer.keyword.maxlength|@|80"]
    },
    clicks:[{
        type: Schema.Types.ObjectId,
        ref: 'Click',
        required: false
    }]
})

module.exports = mongoose.model("Search",SearchSchema)