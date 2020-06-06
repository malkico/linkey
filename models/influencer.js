const mongoose = require("mongoose")
const Schema = mongoose.Schema

const influencerCong = require("./config/influencerConf")
const InfluencerSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref: 'Subscriber',
        unique : "models.unique_taken|@|email",
        required: [true,"models.influencer.subscriber.required"]
    },
    login: {
        type: String,
        unique : "models.unique_taken|@|login",
        required: [true,"models.required|@|login"],
        minlength: [3,"models.minlength|@|login|@|3"],
        maxlength: [30,"models.maxlength|@|login|@|30"]
    },
    password: {
        type: String,
        required: [true,"models.required|@|password"],
        minlength: [30,"models.minlength|@|password|@|30"],
        maxlength: [80,"models.maxlength|@|password|@|80"]
    },
    last_name: {
        type: String,
        required: false,
        minlength: [2,"models.minlength|@|last name|@|2"],
        maxlength: [50,"models.maxlength|@|last name|@|50"]
    },
    registration_date: {
        type: Date,
        required: [true,"models.generated_date"],
        default: Date.now
    },
    niche: {
        type: String,
        index: true,
        required: [true,"models.influencer.niche.required"],
        enum: {
            values: Object.keys(influencerCong.niches),
            message : "models.influencer.niche.enum.message"
        }
    },
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: 'Contact',
        required: [true,"models.influencer.contacts.required"],  
    }],
    links: [{
        type: Schema.Types.ObjectId,
        ref: 'Link',
        required: false
    }]

}) 
 /* .pre('validate', function validate(next) {
    var unique = [];

    for (var i = 0, l = this.link.length; i < l; i++) {
        let key = this.link[i].key;

        if (unique.indexOf(key) > -1) {
            return next(new Error('Duplicated link!'));
        }

        unique.push(key);
    }
    next();
}) */

InfluencerSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Influencer", InfluencerSchema)