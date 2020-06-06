const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ClickSchema = Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'Follower',
        required: [true,'models.click.follower.required'],
    },
    link: {
        type: Schema.Types.ObjectId,
        ref: 'Link',
        required: [true,'models.click.link.required'],
    },
    date: {
        type: Date,
        required: [true,'models.errors.generated_date'],
        default : Date.now
    }
})

module.exports = mongoose.model("Click",ClickSchema)