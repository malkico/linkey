const jwt = require('jsonwebtoken');
const clone = require("clone")

/* ******************* middleware to update the influecer token ****************/
exports.updateInfluencerToken = (req, res, next, page) => {
    jwt.sign({
            influencer_id: res.locals.influencer._id,
            influencer: res.locals.influencer
        },
        process.env.TOKEN_SECRET, {
            expiresIn: '24000h'
        }, (err, token) => {
            if (err) {
                res.locals.result = "Can't create a authentication token for you!"
                res.render(page)
                return
            } else {
                res.cookie(process.env.influencer_token, token, {
                    secure: false
                })
                req.headers.authorization = req.cookies[process.env.influencer_token]
                next()
            }

        }
    )

}

exports.initPage = (req, res, next) => {

    res.locals.influencer_form = clone(res.locals.influencer)
    // res.locals.influencer_form.subscriber.first_name = "test22"
    res.locals.page = "profile"
    const influencerConf = require("../../models/config/influencerConf")
    res.locals.niches = influencerConf.niches
    res.locals.characters = influencerConf.characters
    next()
}