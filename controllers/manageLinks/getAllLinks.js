const InfluencerDao = require("../../Dao/InfluencerDao")
const page = "influencer/all-my-links"

module.exports = [
    (req, res, next) => {
        res.locals.domain = process.env.domain
        res.locals.page = "all-my-links"

        InfluencerDao.getAllLinks(res.locals.influencer)
        .then(results => {
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