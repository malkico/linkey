const profileFncs = require("./profileController/functions")
const page = "influencer/profile"

exports.postPassword = require("./profileController/passwordPOST")
exports.postDetails = require("./profileController/detailsPOST")

exports.get = [
    (req, res, next) => {
        res.locals.tab = "details"
        profileFncs.initPage(req, res, next)
    },
    (req, res, next) => {
        res.render(page)
    }
]