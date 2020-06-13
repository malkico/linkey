const requestIp = require('request-ip');
const Influencer = require("../models/influencer")
const Visit = require("../models/visit")
const Follower = require("../models/follower")
const main_page = 'main'
const follower_page = "follower/index"

exports.get = [
    /* ************************** INITIALISE ****************/
    (req, res, next) => {
        console.log("follower_id : %s",req.cookies.follower_id)
        res.setHeader("Content-type", "text/html");
        next()
    },

    /* *********************** Find influencer ******************/
    (req, res, next) => {
        Influencer.findOne({
                login: req.params.login
            }).populate("links").populate("contacts")
            .then(result => {
                if (Object.keys(result).length) {
                    res.locals.influencer = result
                    res.locals.influencer_insta = res.locals.influencer.contacts.find(contact => contact.which == 'instagram')
                    res.locals.title = "follower_page.title|@|"+res.locals.influencer.login
                    next()
                } else {
                    console.log("influencer not found")
                    res.render(main_page)
                }
            }).catch(err => {
                console.log("%s <= Error when finding an influencer", err)
                res.render(main_page)
            })

    },

    /* ************************ Save the follower ***************************/
    (req, res, next) => {

        // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const ip = requestIp.getClientIp(req);
        // const ip = "19" 
        console.log("adress ip : %s", ip)

        console.log("trying to save the follower")

        // Insert a follower with the new adress ip if not exist
        Follower.findOneAndUpdate({
            ip_adress: ip
        }, {}, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }).then(result => {
            if (!Object.keys(result).length) {
                console.log("follower not saved!")
                res.render(follower_page)
            } else {
                res.cookie("follower_id", result._id.toString(),{SameSite : "Strict"})
                res.locals.follower = result
                console.log("This follower => %s",result)
                next()
            }

        }).catch(err => {
            console.log("%s <= An error producing when saving follower!", err)
            res.render(follower_page)
        })
    },

    /* ************************ Save the visit ***************************/
    (req, res, next) => {

        const visit = new Visit({
            follower: res.locals.follower,
            influencer: res.locals.influencer
        })

        visit.save().then((result) => {
            if (!Object.keys(result).length) {
                console.log("No visit saved!")
                res.render(follower_page)
            } else {
                next()
            }
        }).catch(err => {
            console.log("%s <= An error producing when saving visit", err)
            res.render(follower_page)
        })
    },

    /* ********************** The last middleware ****************** */
    function (req, res) {
        // console.log("influencer => %s",res.locals.influencer)
        res.render(follower_page)
    }
]

exports.error = (err, req, res) => {
    console.log("%s <= render from error middleware")
    res.render(main_page)
}