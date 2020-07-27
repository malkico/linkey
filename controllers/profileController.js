const profileFncs = require("./profileController/functions")
const page = "influencer/profile"

exports.postPassword = require("./profileController/passwordPOST")
exports.postDetails = require("./profileController/detailsPOST")

exports.get = [
    profileFncs.initPage,
    (req, res, next) => {
        res.locals.tab = "profile_details"
        res.render(page)
    }
]