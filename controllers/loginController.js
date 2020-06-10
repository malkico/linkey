const specialFns = require("../config/specialFunctions")
const Influencer = require("../models/influencer")
const jwt = require('jsonwebtoken');
const {
    check,
    validationResult
} = require("express-validator")
const bcrypt = require("bcrypt")
const helper = require("../config/registerHelper")

const page = "account/log-in";
let influencerFound
exports.getPage = function (req, res, next) {
    res.render(page)
    return
}

exports.loginIn = [
    /* ************************************** middlwares to check all my fields  */
    check("email").isEmail().normalizeEmail().withMessage(() => {
        return helper.translate("generals.errors.valid_email");
    }),
    check("password").trim().custom(specialFns.checkSpecialChars),
    check("password").custom( (value) => {return (specialFns.checkPassword(value) === true)}),

    /* ********************** middleware to initialise all my form with req.body. fields */
    (req, res, next) => {
        console.log("initialise all my form")
        res.locals.influencer = {
            email: req.body.email,
            password: req.body.password
        }
        console.log("influencer => %s", res.locals.influencer)
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
    check('email').escape(),
    check('password').escape(),

    /* ************ middleware to find a influencer ***********************/
    (req, res, next) => {
        console.log("find a influencer")
        Influencer.aggregate([{
                    $lookup: {
                        from: "subscribers",
                        localField: "subscriber",
                        foreignField: "_id",
                        as: "subscriber"
                    }
                },
                {
                    $match: {
                        "subscriber.email": res.locals.influencer.email
                    }
                }
            ])
            .then(influencers => {
                if (influencers.length) {
                    influencerFound = influencers[0]
                    console.log("influencer found in DB=> %s", influencers[0])
                    console.log("influencerFound => %s", influencerFound)
                    next()
                } else {
                    res.locals.myErrors.email = helper.translate("account_page.login.result.email_not_found")
                    console.log("myErrors %s", res.locals.myErrors.email)
                    res.render(page)
                    return
                }
            }).catch(err => {
                res.locals.result = "An error was produced while connecting with the database"
                console.log(err)
                res.render(page)
                return
            })
    },
    /* ******************* middleware to compare the hashing password ****************/
    (req, res, next) => {
        console.log("compare the hashing password")
        bcrypt.compare(res.locals.influencer.password, influencerFound.password)
            .then(isEqual => {
                if (isEqual) {
                    next()
                } else {
                    res.locals.result = helper.translate("account_page.login.result.incorrect")
                    res.render(page)
                    return
                }
            })
            .catch(err => {
                // console.log(err)
                console.log("influencerFound => %s", influencerFound)
                res.locals.result = "An error was produced while logging into to your account"
                console.log(err)
                res.render(page)
                return
            })
    },

    /* ******************* middleware to create a token ****************/
    (req, res, next) => {
        jwt.sign({
                influencer_id: influencerFound._id,
                influencer: influencerFound
            },
            process.env.TOKEN_SECRET, {
                expiresIn: '24000h'
            }, (err, token) => {
                if (err) {
                    res.locals.result = "Can't create a authentication token for you!"
                    res.render(page)
                    return
                } else {
                    res.cookie("token", token, {
                        secure: false
                    })
                    req.headers.authorization = req.cookies.token
                    console.log("redirect to dashboard")
                    res.redirect("/dashboard/")
                    return
                }

            }
        )

    }
]

exports.error = (err, req, res, next) => {
    console.log("Error => %s" + err)
    res.locals.result = "An error during the page load"
    res.render(page)
    return
}