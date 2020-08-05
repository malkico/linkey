const Influencer = require("../../models/influencer")
const page = "influencer/all-my-links"
const ObjectId = require("mongoose").Types.ObjectId

module.exports = [
    (req, res, next) => {
        res.locals.domain = process.env.domain
        res.locals.page = "all-my-links"

        Influencer.aggregate([{
            $lookup: {
                from: "links",
                localField: "links",
                foreignField: "_id",
                as: "links"
            }
        }, {
            $match: {
                _id: ObjectId(res.locals.influencer._id)
            }
        }]).then(results => {
            if (results.length) {
                res.locals.links = results[0].links
                console.log("links => %s", res.locals.links)
                next()
            } else {
                res.locals.result = "Can't find your links."
                res.render(page)
                return
            }
        }).catch(err => {
            console.log("error => %s", err)
            res.locals.result = "An error occurred while loading links"
            res.render(page)
            return
        })
    },
    function (req, res, next) {
        res.render(page)
    }
]