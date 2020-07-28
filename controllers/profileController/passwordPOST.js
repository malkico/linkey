const profileFncs = require("./functions")
const specialFns = require("../../config/specialFunctions")
const helpers = require("../../config/registerHelper")
const page = "influencer/profile"
const bcrypt = require("bcrypt")

const {    check,
    validationResult
} = require("express-validator")
require

const passwordPOST = [
    (req, res, next) => {
        res.locals.tab = "password"
        profileFncs.initPage(req, res, next)
    },
    check("old_password").trim().custom(specialFns.checkSpecialChars),
    check("new_password").custom(specialFns.checkSpecialChars),
    check("new_password").custom(value => {
        return (specialFns.checkPassword(value) === true)
    }),
    check("confirm_password").trim().custom((value, {
            req
        }) =>
        (value === req.body.new_password)
    ).withMessage(() => {
        return helpers.translate("account_page.signup.form.confirm_password.identical")
    }),

    /* ********************** middleware to check if there are any errors found on the form */
    (req, res, next) => {
        res.locals.myErrors = {}
        res.locals.ressult = null
        const errors = validationResult(req).errors
        errors.forEach(element => {
            res.locals.myErrors[element.param] = element.msg
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
    check("old_password").escape(),
    check("new_password").escape(),
    check("confirm_password").escape(),

    /* ***************** Check if the old password is correct **************/
    (req, res, next) => {
        res.locals.form = {
            ...req.body
        }
        console.log("form pass => %s", res.locals.form)
        next()
    },
    /* ******************* middleware to compare the hashing password ****************/
    (req, res, next) => {
        console.log("compare the hashing password")
        bcrypt.compare(res.locals.form.old_password, res.locals.influencer.password )
            .then(isEqual => {
                if (isEqual) {
                    next()
                } else {
                    res.locals.result = helpers.translate("dashboard.profile.tabs.password.form.result.compare_password")
                    res.render(page)
                    return
                }
            })
            .catch(err => {
                // console.log(err)
                // console.log("influencerFound => %s", influencerFound)
                res.locals.result = "An error was produced while changing your password"
                console.log(err)
                res.render(page)
                return
            })
    },

    /* ********************** middleware to hashing my password */
    (req, res, next) => {
        console.log("password to hash : %s", res.locals.form.new_password)
        bcrypt.hash(res.locals.form.new_password, 10)
            .then((hashed) => {
                res.locals.hashed_pass = hashed
                console.log("%s => %s",res.locals.form.new_password,res.locals.hashed_pass)
                next()
            })
            .catch((err) => {
                const msg = 'An error was generated while hashing the password'
                console.log("%s => %s", msg, err)
                res.locals.myErrors["new_password"] = msg
                res.render(page)
                return
            })
    },

    /* ******************* UPDATE the influencer *****************/
    (req, res, next) => {

        const Influencer = require("../../models/influencer")
        Influencer.updateOne({
            _id : require("mongoose").Types.ObjectId(res.locals.influencer._id)
            },{
                password : res.locals.hashed_pass
            },{
                runValidators : true
            }).then(result => {
                console.log("result => %s",result)
                res.locals.result = helpers.translate("dashboard.profile.tabs.password.form.result.success")
                res.locals.influencer.password = res.locals.hashed_pass
                console.log(res.locals.result)
                res.locals.success = true
                next()
            }).catch(err => {
                console.log(err)
                res.locals.ressult = "Error! %s",err
                res.render(page)
                return
            })
    },

    (req, res, next) => {
        profileFncs.updateInfluencerToken(req, res, next, page)
    },

    (req, res, next) => {
        console.log("influencer => %s" ,res.locals.influencer)
        res.render(page)
    }
]

module.exports = passwordPOST