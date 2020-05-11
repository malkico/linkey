const Subscriber = require("../models/subscriber")
const Influencer = require("../models/influencer")
const influencerCong = require("../models/config/influencerConf")
const specialFunctions = require("../config/specialFunctions")

const {
    check,
    validationResult
} = require('express-validator');

const getController = (req, res, next) => {
    res.locals.niches = influencerCong.niches
    res.locals.subscriber_signin = req.session.subscriber_signin
    console.log("get a sign in page")
    console.log(req.session.subscriber_signin)
    res.render("account/sign-up")
}

const postController = [
    (req, res, next) => {
        res.locals.niches = influencerCong.niches
        res.locals.subscriber_signin = req.session.subscriber_signin
        next()
    },
    /* ************************************** middlwares to check all my fields  */
    check("subscriber_id").trim().custom(specialFunctions.checkSpecialChars),
    // check("first_name").trim().custom(specialFunctions.checkSpecialChars),
    // check("email").normalizeEmail().isEmail().withMessage("Please enter a valid email."),
    check("niche").trim().custom(specialFunctions.checkSpecialChars),
    check("password").custom(specialFunctions.checkSpecialChars),
    check("password").custom(specialFunctions.checkPassword),
    check("confirm_password", "Please enter a valid password").trim(),
    check("confirm_password").custom((value, {
            req
        }) =>
        (value === req.body.password)
    ).withMessage("The two passwords must be identical"),
    check("agreement").custom((value) =>
        (typeof (value) !== 'undefined')
    ).withMessage("Sorry but you have to"),

    /* ********************** middleware to initialise all my form with req.body. fields */
    (req, res, next) => {
        res.locals.form = {
            'confirm_password': req.body.confirm_password,
            'agreement': req.body.agreement
        }
        res.locals.subscriber = new Subscriber({
            _id: res.locals.subscriber_signin._id,
            first_name: res.locals.subscriber_signin.first_name,
            email: res.locals.subscriber_signin.email
        })
        res.locals.influencer = new Influencer({
            niche: req.body.niche,
            password: req.body.password,
            subscriber: res.locals.subscriber._id,
            login: res.locals.subscriber_signin.email.split('@')[0] + (Math.floor(Math.random() * (9999 - 0 + 1)))
        })

        next()
    },

    /* ********************** middleware to check if there are any errors found on the form */
    (req, res, next) => {
        res.locals.myErrors = {}
        res.locals.result = null
        const errors = validationResult(req).errors
        errors.forEach(element => {
            res.locals.myErrors[element.param] = element.msg
            console.log("%s => %s", element.param, element.msg)
        });

        if (Object.keys(res.locals.myErrors).length) {
            next(new Error("There are arrors!"))
        } else
            next()
    },

    /* ***************** middlwares to escape all my fields ****************/
    check('niche').escape(),
    check('password').escape(),

    /* *********** middlware to check the subscriber model ***************/
    (req, res, next) => {
        console.log("middlware to check the subscriber model")
        console.log(res.locals.subscriber)
        res.locals.subscriber.validate().then(() => {
            next()
        }).catch(err => {
            const errors = err.errors
            Object.keys(errors).forEach((key) => {
                res.locals.myErrors[errors[key].path] = errors[key].message
                console.log("%s => %s ", errors[key].path, errors[key].message)
            })

            next(new Error("There are some errors in your email and first name "))
        })

        console.log(" errors lenght 222 : ")

    },
    // check and find the subscriber in database
    (req, res, next) => {

        console.log("check and find the subscriber in database")
        Subscriber.findOne({
            _id: res.locals.subscriber._id,
            email: res.locals.subscriber.email
        }, (err, subscriber) => {
            // if the  query don't find the subscriber
            if (err) {
                res.locals.myErrors["email"] = "An unexpected error has occurred, please return to the previous page and try again"
                next(err)
            } else if (subscriber)
                next()
            else {
                res.locals.myErrors["email"] = "Something is wrong with your email, please contact us"
                next(new Error(res.locals.myErrors["email"]))
                console.log(res.locals.subscriber_id)
            }

        })

    },
    /* *************** middlware to check ans save the influencer ********/
    (req, res, next) => {
        console.log(res.locals.influencer)
        res.locals.influencer.save((err) => {
            if (err) {
                if (err.errors) {
                    Object.keys(err.errors).forEach((key) => {
                        res.locals.myErrors[err.errors[key].path] = err.errors[key].message
                        console.log("%s => %s ", err.errors[key].path, err.errors[key].message)
                    })
                } else
                    res.locals.result = "An error was produced during your registration, please contact us"
                next(err)
            } else
                next()

        })

    },
    (req, res, next) => {
        console.log("influencer and saved! new client yéeeey")
        req.session.influencer = res.locals.influencer
        res.redirect("/dashboard/")
    }
]

const errorController = (err, req, res, next) => {
    console.log(err.stack)
    if (!res.locals.result)
        res.locals.result = "Please verify that all fields are valid"
    res.render("account/sign-up")

}

exports.errorController = errorController
exports.getController = getController
exports.postController = postController