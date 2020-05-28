const linkConf = require("../models/config/linkConf")
const Link = require('../models/link')
const Influencer = require("../models/influencer")
const async = require("async")
const ObjectId = require('mongoose').Types.ObjectId; 

const {
    check,
    validationResult
} = require('express-validator');
const specialFncs = require('../config/specialFunctions')
const page = "influencer/add-link"

// Console.log(Link.link_type[0]);
exports.get = function (req, res, next) {
    res.render(page, {
        link_type: linkConf.link_type
    })
    return
}

exports.post = [
    /* *********************** middleware to initale my page **********/
    (req, res, next) => {
        res.locals.link_type = linkConf.link_type
        next()
    },

    /* *********************** middlewares to check my fields **********/
    check("url").trim().isURL().withMessage("Please enter a valid url"),
    check("title").trim().custom(specialFncs.checkSpecialChars),
    check("key").trim(),

    /* ********************** middleware to initialise all my form with req.body. fields */
    (req, res, next) => {
        console.log("initialise all my form")
        res.locals.link = new Link({
            url: req.body.url,
            title: req.body.title,
            key: req.body.key,
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
                            "links.key": res.locals.link.key
                        }
                    }]

                ).then((result) => {
                    console.log("%s - %s ",res.locals.influencer._id, res.locals.link.key)
                    console.log("check a key: "+result)
                    if (Object.keys(result).length) {
                        res.locals.result = "Please enter another key"
                        res.locals.myErrors.key = "Duplicated key!"
                        res.render(page)
                        return
                    } else
                        callback(null, true)

                }).catch(err => {
                    res.locals.result = "Error! Cannot check the key"
                    callback(err, null)
                })
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
                        res.locals.result = "Can't add the link in dataBase, Please try again later"
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
                res.locals.result = "link successfully added"
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