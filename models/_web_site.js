/* const mongoose = require("mongoose")
const Schema = mongoose.Schema

const WebSiteSchema = new Schema({
        which : {
        type: String,
        required: true,
        enum: ['instagram','facebook','twitter','snapchat','tiktok','youtube','linkedin','github','behance','mail','blog','store','portfolio','personal/company website','other']
    },
    domaine_name: {
        type: String,
        required: false,
        enum: [
            'https://www.instagram.com/',
            'https://www.facebook.com/',
            'https://twitter.com/',
            'https://story.snapchat.com/s/',
            'https://www.tiktok.com/@',
            'https://www.youtube.com/channel/',
            'https://www.linkedin.com/in/',
            'https://github.com/',
            'https://www.behance.net/',
            'mailto:'
        ]
    }
})

module.exports = mongoose.model("WebSite", WebSiteSchema)

*/