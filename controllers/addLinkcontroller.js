const linkConf = require("../models/config/linkConf")
const Link = require('../models/link')
const Influencer = require("../models/influencer")
const async = require("async")
const ObjectId = require('mongoose').Types.ObjectId;
const helper = require("../config/registerHelper")

const {
    check,
    validationResult
} = require('express-validator');
const specialFncs = require('../config/specialFunctions');
const page = "influencer/form-link"

// Console.log(Link.link_type[0]);
exports.get = function (req, res, next) {
    res.locals.page = "add-link"
    res.locals.page_title = helper.translate("dashboard.add_link.page_title")
    res.render(page, {
        link_type: linkConf.link_type
    })
    return
}

exports.post = [
    /* *********************** middleware to initale my page **********/
    (req, res, next) => {
        res.locals.page = "add-link"
        res.locals.link_type = linkConf.link_type
        next()
    },

    /* *********************** middlewares to check my fields **********/
    check("URL").trim().isURL().withMessage(() => {
        return helper.translate("dashboard.add_link.form.URL.errors.valid")
    }),
    check("title").trim().custom(specialFncs.checkSpecialChars),
    check("KEY").trim(),

    /* ********************** middleware to initialise all my form with req.body. fields */
    (req, res, next) => {
        console.log("initialise all my form")
        res.locals.link = new Link({
            URL: req.body.URL,
            title: req.body.title,
            KEY: req.body.KEY,
            main: (typeof (req.body.main) !== "undefined"),
            link_type: req.body.link_type
        })
        console.log("my form is initalised => %s", res.locals.link)

        next()
    },

    /* ********************** middleware to check if there are any errors found on the form */
    (req, res, next) => {
        res.locals.myErrors = {}
        res.locals.result = null
        console.log("check if there are any errors")
        const errors = validationResult(req).array()
        errors.forEach(err => {
            res.locals.myErrors[err.param] = err.msg
        });

        if (errors.lenght) {
            res.locals.result = "Please check for errors produced"
            res.render(page)
            console.log(res.locals.result)
            return
        } else
            next()

    },

    /* ***************** middlwares to escape all my fields ****************/
    check("title").escape(),

    /* ***************** middlwares to save the new link ****************/
    (req, res, next) => {
        console.log("save the new link")
        async.series({
            checkTheKey: function (callback) {
                // just check if the the influencer enter a KEY
                if (res.locals.link.KEY) {
                    Influencer.aggregate([{
                            $lookup: {
                                from: "links",
                                localField: "links",
                                foreignField: "_id",
                                as: "links",
                            }
                        }, {
                            $match: {
                                _id: ObjectId(res.locals.influencer._id),
                                "links.KEY": res.locals.link.KEY
                            }
                        }]

                    ).then((result) => {
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
                } else{
                    callback(null, true)
                }
            },
            alink: function (callback) {
                res.locals.link.save()
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
                        res.locals.result =  helper.translate("dashboard.add_link.form.result.cant_add")
                        callback(err, null)
                    })
            },
            toInfluencer: function (callback) {
                console.log("update influencer links")
                Influencer.updateOne({
                        _id: res.locals.influencer._id
                    }, {
                        $push: {
                            links: res.locals.link
                        }
                    }, {
                        runValidators: true
                    })
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