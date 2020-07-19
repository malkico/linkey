const jwt = require('jsonwebtoken');
const helper = require("../config/registerHelper")

module.exports = (req, res, next) => {
    
    req.headers.authorization = req.cookies.token
    jwt.verify(req.cookies.token, process.env.TOKEN_SECRET, (err,decoded) => {

        if(err){
            res.locals.result = helper.translate("account_page.login.errors.authenticated_first")
            res.render("account/log-in")
            return
        }

        console.log("decodedToken => %s", decoded)
        
        if(decoded && decoded.influencer_id && decoded.influencer){
            console.log("successful authentication with the given token")
            res.locals.influencer = decoded.influencer
            next()
        } else {
            res.locals.result = "An Error! You must be authenticated first"
            res.render("account/log-in")
            return
        }
    })

}