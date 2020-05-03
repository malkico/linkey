const mongoose = require("mongoose")
const Schema = mongoose.Schema

const webSite = {
    'Instagram': 'https://www.instagram.com/',
    'Facebook': 'https://www.facebook.com/',
    'Twitter': 'https://twitter.com/',
    'Snapchat': 'https://story.snapchat.com/s/',
    'Tiktok': 'https://www.tiktok.com/@',
    'Youtube': 'https://www.youtube.com/channel/',
    'Linkedin': 'https://www.linkedin.com/in/',
    'Github': 'https://github.com/',
    'Behance': 'https://www.behance.net/',
    'Behance': 'https://www.twitch.tv/',
    'Mail': 'mailto:'

}

const SocialMediaSchema = new Schema({
    which: {
        type: String,
        required: true,
        enum: ['Instagram', 'Facebook', 'Twitter', 'Snapchat', 'Tiktok', 'Youtube', 'Linkedin', 'Github', 'Behance', 'Twitch','Mail', 'Blog', 'Store', 'Portfolio', 'Personal/Company Website', 'Other']
    },
    link: {
        type: String,
        required: true,
        min: 6,
        max: 120
    }
}).virtual("web_site").get(function () {
    return webSite.get(this.which)
})

module.exports = mongoose.model("SocialMedia", SocialMediaSchema)