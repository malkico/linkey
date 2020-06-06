const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SearchSchema = Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,'models.required|@|follower'],
    },
    influencer : {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: [true,'models.required|@|influencer id'],
    },
    date: {
        type: Date,
        required: [true,'models.generated_date'],
        default : Date.now
    } ,
    keyword : {
        type:String,
        required: [true,"models.search.keyword.required"],
        maxlength: [80,'models.maxlength|@|keyword|@|80']
    },
    clicks:[{
        type: Schema.Types.ObjectId,
        ref: 'Click',
        required: false
    }]
})

module.exports = mongoose.model("Search",SearchSchema)