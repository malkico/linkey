const linkConf = require("../models/config/linkConf")
const InfluencerDao = require("../Dao/InfluencerDao")
const async = require("async")
const helper = require("../config/registerHelper")

const specialFncs = require('../config/specialFunctions');
const page = "influencer/form-link"

// Console.log(Link.link_type[0]);
exports.get = function (req, res, next) {
    res.locals.page = "add-link"
    res.locals.page_title = helper.translate("dashboard.add_link.page_title")
    res.locals.submit = helper.translate("dashboard.add_link.form.submit")
    res.render(page, {
        link_type: linkConf.link_type
    })
    return
}

exports.post = [
    /* *********************** middleware to initale my page **********/
    (req, res, next) => {
        res.locals.page = "add-link"
        res.locals.page_title = helper.translate("dashboard.add_link.page_title")
        res.locals.submit = helper.translate("dashboard.add_link.form.submit")
        next()
    },
    require("./manageLinks/init_middlwares_aLink"),
    /* ***************** middlwares to save the new link ****************/
    (req, res, next) => {
        console.log("save the new link")
        async.series({
            checkTheKey: function (callback) {
                // just check if the the influencer enter a KEY
                if (res.locals.link.KEY) {
                    InfluencerDao.checkKeyAlreadyExist(res.locals.influencer, res.locals.link)
                        .then((result) => {
                            console.log("%s - %s ", res.locals.influencer._id, res.locals.link.KEY)
                            console.log("check a key: " + result)
                            if (Object.keys(result).length) {
                                res.locals.result = helper.translate("dashboard.add_link.form.result.KEY")
                                res.locals.myErrors.KEY = helper.translate("dashboard.add_link.form.KEY.errors.Duplicated")
                                res.render(page)
                                return
                            } else
                                callback(null, true)

                        }).catch(err => {
                            res.locals.result = "Error! Cannot check the key"
                            callback(err, null)
                        })
                } else {
                    callback(null, true)
                }
            },
            alink: function (callback) {
                const LinkDao = require("../Dao/LinkDao")
                LinkDao.saveTempOne(res.locals.link)
                    .then(newLink => {
                        if (!Object.keys(newLink).length) {
                            res.locals.result = "Cant't find the link you just added to the database"
                            res.render(page)
                            return
                        } else {
                            console.log("link added!")
                            callback(null, true)
                        }
                    })
                    .catch(err => {
                        res.locals.result = helper.translate("dashboard.add_link.form.result.cant_add")
                        callback(err, null)
                    })
            },
            toInfluencer: function (callback) {
                console.log("update influencer links")
                InfluencerDao.addLink(res.locals.influencer, res.locals.link)
                    .then(influencerUpdated => {
                        if (!Object.keys(influencerUpdated).length) {
                            res.locals.result = "Cant't find the link you just added to your account"
                            res.render(page)
                            return
                        } else
                            callback(null, true)
                    })
                    .catch(err => {
                        res.locals.result = "Can't update your links, Please try again later"
                        callback(err, null)
                    })
            }
        }, (err, results) => {
            if (err) {
                specialFncs.catchErrors(err.errors, res.locals.myErrors)
                console.log("%s \n %s", err, res.locals.result)
                res.render(page)
                return

            } else if (results.alink && results.toInfluencer && results.checkTheKey) {
                res.locals.result = helper.translate("dashboard.add_link.form.result.success")
                res.locals.success = true
                next()
            }
        })
    },

    /* ************************ The LAST middleware *******************/
    function (req, res, next) {
        console.log("LAST middleware")
        res.render(page)
        return
    }
]

exports.error = (err, req, res, next) => {
    res.locals.result = "An error was produced"
    console.log("%s \n %s ", err, res.locals.result)
    res.render(page, {
        link_type: linkConf.link_type
    })
    return
}