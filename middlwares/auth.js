const jwt = require('jsonwebtoken');
const helper = require("../config/registerHelper")

module.exports = (req, res, next) => {
    
    req.headers.authorization = req.cookies[process.env.influencer_token]
    jwt.verify(req.cookies[process.env.influencer_token], process.env.TOKEN_SECRET, (err,decoded) => {

        if(err){
            res.locals.result = helper.translate("account_page.login.errors.authenticated_first")
            res.render("account/log-in")
            return
        }

        console.log("decodedToken => %s", decoded)
        console.log("decodedToken influencer_id => %s", decoded.influencer_id)
        console.log("decodedToken influencer => %s", decoded.influencer)
        
        if(decoded && decoded.influencer_id && decoded.influencer){
            console.log("successful authentication with the given token")
            res.locals.influencer = decoded.influencer
            next()
        } else {
            res.locals.result = helper.translate("account_page.login.errors.authenticated_first")+"."
            res.render("account/log-in")
            return
        }
    })

}