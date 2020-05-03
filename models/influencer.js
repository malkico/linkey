const mongoose = require("mongoose")
const Schema = mongoose.Schema

const InfluencerSchema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 30
    },
    subscriber:{
        type: Schema.Types.ObjectId,
        ref: 'Subscriber',
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 30
    },
    last_name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    registration_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    niche: {
        type: String,
        required: true,
        enum: ['Humor & Memes', 'Fashion & Style', 'Fitness', 'Quotes & Texts', 'Luxury & Motivation', 'Cars', 'Motorcycles', 'Nature', 'Food & Nutrition', 'Animals', 'Models', 'Ambassadors & Influencers', 'Music & Singers', 'Art', 'Technology', 'Gaming', 'Entrepreneurship', 'Architecture & Interior', 'Fan Accounts', 'Celebrity', 'Policy', 'Makeup', 'Hair', 'Nails', 'Sports', 'Love & Romance', 'Travel', 'Dogs', 'Cats', 'other']
    },
    social_media: [{
        type: Schema.Types.ObjectId,
        ref: 'SocialMedia',
        required: true
    }],
    link: [{
        type: Schema.Types.ObjectId,
        ref: 'Link',
        required: false
    }]

}).index(
    { niche: true }
).index(
    { _id : true, "link.key" : true },{ unique : true}
).pre('validate', function validate(next) {
    var unique = [];

    for (var i = 0, l = this.link.length; i < l; i++) {
        let key = this.link[i].key;

        if (unique.indexOf(key) > -1) {
            return next(new Error('Duplicated link!'));
        }

        unique.push(key);
    }
    next();
})


module.exports = mongoose.Model("Influencer", InfluencerSchema)