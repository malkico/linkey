const requestIp = require('request-ip');
const InfluencerDao = require("../Dao/InfluencerDao")
const Visit = require("../models/visit")
const main_page = 'main'
const follower_page = "follower/index"

exports.get = [
    /* ************************** INITIALISE ****************/
    (req, res, next) => {
        console.log("follower_id : %s", req.cookies[process.env.prefix + "follower_id"])
        res.locals.env = process.env
        res.setHeader("Content-type", "text/html");
        next()
    },

    /* *********************** Find influencer ******************/
    (req, res, next) => {
        InfluencerDao.getLinks(req.params.login)
            .then(result => {
                if (Object.keys(result).length) {
                    res.locals.influencer = result
                    res.locals.influencer_insta = res.locals.influencer.contacts.find(contact => contact.which == 'instagram')
                    res.locals.title = "follower_page.title|@|" + res.locals.influencer.login
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

        const FollowerDao = require("../Dao/FollowerDao")

        // Insert a follower with the new adress ip if not exist
        FollowerDao.addFollower(ip).then(result => {
            if (!Object.keys(result).length) {
                console.log("follower not saved!")
                res.render(follower_page)
            } else {
                res.cookie(process.env.prefix + "follower_id", result._id.toString(), {
                    SameSite: "Strict"
                })
                res.locals.follower = result
                console.log("This follower => %s", result)
                next()
            }

        }).catch(err => {
            console.log("%s <= An error producing when saving follower!", err)
            res.render(follower_page)
        })
    },

    /* ************************ Save the visit ***************************/
    (req, res, next) => {
        const VisitDao = require("../Dao/VisitDao")
        const visit = new Visit({
            follower: res.locals.follower,
            influencer: res.locals.influencer
        })

        VisitDao.saveOne(visit).then((result) => {
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