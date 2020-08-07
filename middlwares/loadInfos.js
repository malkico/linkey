const Influencer = require("../models/influencer")

/* *********************** Find influencer ******************/
    module.exports = (req, res, next) => {
        Influencer.findOne({
                login: res.locals.influencer.login
            }).populate("contacts")
            .then(result => {
                if (Object.keys(result).length) {
                    // res.locals.influencer = result
                    res.locals.influencer_insta = result.contacts.find(contact => contact.which == 'instagram')
                    next()
                } else {
                    console.log("can't load influencer infos")
                }
            }).catch(err => {
                console.log("%s <= Error when loading influencer infos", err)
            })

    }