const mongoose = require("mongoose")
const Schema = mongoose.Schema

const influencerCong = require("./config/influencerConf")
const InfluencerSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref: 'Subscriber',
        unique : "models.influencer.subscriber.unique",
        required: [true,"models.influencer.subscriber.required"]
    },
    login: {
        type: String,
        unique : "models.influencer.login.unique",
        required: [true,"models.influencer.login.required"],
        minlength: [3,"models.influencer.login.minlength|@|3"],
        maxlength: [30,"models.influencer.login.maxlength|@|30"]
    },
    password: {
        type: String,
        required: [true,"models.influencer.password.required"],
        minlength: [30,"models.influencer.password.minlength|@|30"],
        maxlength: [80,"models.influencer.password.maxlength|@|80"]
    },
    last_name: {
        type: String,
        required: false,
        minlength: [2,"models.influencer.last_name.minlength|@|2"],
        maxlength: [50,"models.influencer.last_name.maxlength|@|50"]
    },
    registration_date: {
        type: Date,
        required: [true,"models.errors.generated_date"],
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