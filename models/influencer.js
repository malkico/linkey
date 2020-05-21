const mongoose = require("mongoose")
const Schema = mongoose.Schema

const influencerCong = require("./config/influencerConf")
const InfluencerSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref: 'Subscriber',
        unique: "This email is already taken.",
        required: [true,'Are you sure that you already enter your email and your first name !']
    },
    login: {
        type: String,
        required: [true,'The login is required'],
        unique: 'this login is already taken',
        minlength:  [3,'The login is shorter than the minimum allowed length (3)'],
        maxlength: [30,'The login is longer than the maximum allowed length (30)']
    },
    password: {
        type: String,
        required: [true,'The password is required'],
        minlength:  [30,'The password is shorter than the minimum allowed length (30)'],
        maxlength: [80,'The password is longer than the maximum allowed length (80)']
    },
    last_name: {
        type: String,
        required: false,
        minlength:  [2,'The last name is shorter than the minimum allowed length (2)'],
        maxlength: [50,'The last name is longer than the maximum allowed length (50)']
    },
    registration_date: {
        type: Date,
        required: [true,'An error was generated when assigning a registration date, please check the date and time on your device.'],
        default: Date.now
    },
    niche: {
        type: String,
        index: true,
        required: [true,"You must choose your niche, if you did not find the right niche, you can choose other, and please contact us"],
        enum: {
            values: influencerCong.niches,
            message : "If you didn't find the right niche, you can choose other, and please contact us"
        }
    },
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: 'Contact',
        required: [true,"You should link your account with at least one contact information"],  
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