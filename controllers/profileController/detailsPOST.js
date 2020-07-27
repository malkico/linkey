const profileFncs = require("../profileController/functions")
const page = "influencer/profile"
const clone = require("clone")
const {
    check,
    validationResult
} = require("express-validator")
const specialFns = require("../../config/specialFunctions")
const Influencer = require("../../models/influencer")
const Subscriber = require("../../models/subscriber")
const mongoose = require("mongoose")
const async = require("async")
const helpers = require("../../config/registerHelper")


 const postDetails = [
    profileFncs.initPage,
    check("first_name").trim().custom(specialFns.checkSpecialChars),
    check("last_name").trim().custom(specialFns.checkSpecialChars),
    check("login").trim().custom(specialFns.checkSpecialChars),
    check("niche").trim().custom(specialFns.checkSpecialChars),

    /* *************************** initiale form *********/
    (req, res, next) => {
        console.log("postDetails")
        res.locals.influencer_form = {
            subscriber: {
                first_name: req.body.first_name,
            },
            last_name: req.body.last_name,
            login: req.body.login,
            niche: req.body.niche
        }

        next()
    },

    /* ********************** middleware to check if there are any errors found on the form */
    (req, res, next) => {
        res.locals.myErrors = {}
        res.locals.ressult = null
        const errors = validationResult(req).errors
        errors.forEach(element => {
            res.locals[element.param] = element.msg
        })

        if (!Object.keys(res.locals.myErrors).length) {
            next()
        } else {
            res.render(page)
            res.locals.result = helpers.translate("dashboard.profile.tabs.profile.form.result.error")
            return
        }

    },

    /* ***************** middlwares to escape all my fields ****************/
    check("first_name").escape(),
    check("last_name").escape(),
    check("login").escape(),

    (req, res, next) => {
        async.parallel({
            updateInfluencer: callback => {
                Influencer.findOneAndUpdate({
                        _id: mongoose.Types.ObjectId(res.locals.influencer._id),
                    }, {
                        $set: {
                            last_name: req.body.last_name,
                            login: req.body.login,
                            niche: req.body.niche
                        }

                        // ...req.boy
                    }, {
                        new: false,
                        runValidators: true
                    },
                    (err, result) => {
                        if (err) {
                            specialFns.catchErrors(err.errors, res.locals.myErrors)
                            console.log("some errors %s", err)
                            res.locals.result = helpers.translate("dashboard.profile.tabs.profile.form.result.error")
                            res.render(page)
                            return
                        } else if (result) {
                            // console.log("influencer %s is updated! => ", res.locals.influencer._id, result)
                            callback(null, true)
                        }
                    })
            },
            updateSubscriber: callback => {
                console.log("subscriber id => ", res.locals.influencer.subscriber._id)
                console.log("update the subscriber")
                Subscriber.findOneAndUpdate({
                    _id: mongoose.Types.ObjectId(res.locals.influencer.subscriber._id)
                }, {
                    first_name: req.body.first_name
                }, {
                    runValidators: true
                }, (err, result) => {
                    if (result) {
                        callback(null, true)
                    } else {
                        if (err)
                            specialFns.catchErrors(err.errors, res.locals.myErrors)
                        console.log("can't update the subscriber %s ", result)
                        res.locals.result = helpers.translate("dashboard.profile.tabs.profile.form.result.error")
                        res.render(page)
                        return
                    }
                })

            }
        }, (err, results) => {
            console.log("éee")
            if (results.updateSubscriber && results.updateInfluencer) {
                res.locals.success = true;
                res.locals.result = helpers.translate("dashboard.profile.tabs.profile.form.result.success")

                const subscriberObj = clone(res.locals.influencer.subscriber)
                Object.assign(subscriberObj, res.locals.influencer_form.subscriber)
                Object.assign(res.locals.influencer, res.locals.influencer_form)
                Object.assign(res.locals.influencer.subscriber, subscriberObj)
                console.log("assign is finished !")
                next()
            }
        })
    },
    (req, res, next) => {
        profileFncs.updateInfluencerToken(req, res, next, page)
    },
    (req, res, next) => {
        res.render(page)
    }
]

module.exports = postDetails