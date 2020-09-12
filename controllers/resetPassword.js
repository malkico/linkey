const {
    check,
    validationResult
} = require("express-validator")
const helpers = require('../config/registerHelper')
const page = "account/reset-password"
const InfluencerDao = require("../Dao/InfluencerDao")

exports.post = [
    check("email").isEmail().withMessage(() => {
        return helpers.translate("generals.errors.valid_email");
    }),

    /* ************* initiale the form ****************** */
    (req, res, next) => {
        res.locals.form = {
            influencer: {
                subscriber: {
                    ...req.body
                }
            }
        }
        next()
    },

    /* ********************** middleware to check if there are any errors found on the form */
    (req, res, next) => {
        res.locals.myErrors = {}
        res.locals.result = null
        const errors = validationResult(req).array()
        errors.forEach(err => {
            res.locals.myErrors[err.param] = err.msg
        })

        if (errors.length == 0)
            next()
        else {
            // res.locals.result = "There are some errors"
            console.log("There are some errors %s", errors.length)
            res.render(page)
            return
        }
    },

    /* ***************** middlwares to escape all my fields ****************/
    check("email").escape(),

    /* ************ middleware to find an influencer ***********************/
    (req, res, next) => {
        console.log("find a influencer")
        InfluencerDao.findEmail(res.locals.form.influencer.subscriber)
            .then(influencers => {
                res.locals.result = helpers.translate('account_page.reset_password.result.password_sent')
                res.locals.success = true
                if (influencers.length) {
                    const influencerFound = influencers[0]
                    console.log("influencer found in DB=> %s", influencers.length)
                    console.log("influencerFound => %s", influencerFound)
                    /* res.locals.form.influencer.subscriber = {
                        ...influencerFound.subscriber
                    } */
                    res.locals.form.influencer = influencerFound
                    next()
                } else {
                    console.log("Can't find an influencer with this email")
                    res.render(page)
                    return
                }
            }).catch(err => {
                res.locals.result = "An error was produced while connecting with the database"
                console.log(err)
                res.render(page)
                return
            })
    }, (req, res, next) => {
        const mailer = require("../middlwares/mailer")
        mailer.resetPass(res.locals.form.influencer, res, next, page)
    },
    (req, res, next) => {
        res.render(page)
    }
]

/* **************************** ROUTE: Change the password on DB *****************/
exports.changePassword = [

    /* ********************** middleware to hashing my password */
    (req, res, next) => {
        const bcrypt = require("bcrypt")
        console.log("password to hash : %s", req.params.pass)
        bcrypt.hash(req.params.pass, 10)
            .then((hashed) => {
                res.locals.hashed_pass = hashed
                next()
            })
            .catch((err) => {
                const msg = 'An error was generated while hashing the password'
                console.log("%s => %s", msg, err)
                res.locals.myErrors = {}
                res.locals.result = msg
                res.render(page)
                return
            })

        /* ********** changing the password on DB *************/
    }, (req, res, next) => {
        InfluencerDao.changePassword({
                influencer: {
                    _id: req.params.influencer_id
                }
            })
            .then(result => {
                if (result.nModified) {
                    console.log("result => %s", result)
                    res.locals.result = helpers.translate('account_page.reset_password.result.password_reset')
                    res.locals.success = true
                    next()
                } else {
                    res.locals.result = "Can't change the password with this link"
                    res.render(page)
                    return
                }

            }).catch(err => {
                console.log("err => %s", err)
                res.locals.result = "An error occurred while modifying the password, Please try again"
                res.render(page)
                return
            })

    },
    (req, res, next) => {
        res.render(page)
    }
]


exports.get = (req, res, next) => {
    res.render(page)
}