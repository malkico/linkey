const Subscriber = require("../models/subscriber")
const Influencer = require("../models/influencer")
const InfluencerDao = require("../Dao/InfluencerDao")
const SubscriberDao = require("../Dao/SubscriberDao")
const influencerCong = require("../models/config/influencerConf")
const specialFns = require("../config/specialFunctions")
const bcrypt = require("bcrypt")
const helper = require("../config/registerHelper")
const mailer = require("../middlwares/mailer")

let confirm_code
const {
    check,
    validationResult
} = require('express-validator');

const getController = (req, res) => {
    res.locals.niches = influencerCong.niches
    res.locals.subscriber_signin = req.session.subscriber_signin
    console.log("get a sign in page")
    console.log(req.session.subscriber_signin)
    res.render("account/sign-up")
}

const postController = [
    (req, res, next) => {
        console.log("post Ctrl");
        res.locals.niches = influencerCong.niches
        res.locals.subscriber_signin = req.session.subscriber_signin
        next()
    },
    /* ************************************** middlwares to check all my fields  */
    check("subscriber_id").trim().custom(specialFns.checkSpecialChars),
    // check("first_name").trim().custom(specialFunctions.checkSpecialChars),
    // check("email").isEmail().withMessage("Please enter a valid email."),
    check("niche").trim().custom(specialFns.checkSpecialChars),
    check("password").custom(specialFns.checkSpecialChars),
    check("password").custom(value => {
        return (specialFns.checkPassword(value) === true)
    }),
    // check("confirm_password").withMessage( () => { return helper.translate("account_page.signup.form.confirm_password.valid")}),
    check("confirm_password").trim().custom((value, {
            req
        }) =>
        (value === req.body.password)
    ).withMessage(() => {
        return helper.translate("account_page.signup.form.confirm_password.identical")
    }),
    check("agreement").custom((value) =>
        (typeof (value) !== 'undefined')
    ).withMessage(() => {
        return helper.translate("account_page.signup.form.agree.you_should")
    }),

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
        res.locals.influencer = {
            niche: req.body.niche,
            password: req.body.password,
            subscriber: res.locals.subscriber._id,
            login: res.locals.subscriber_signin.email.split('@')[0] + (Math.floor(Math.random() * (9999 - 0 + 1)))
        }

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
            specialFns(err.errors, res.locals.myErrors)
            next(new Error("There are some errors in your email and first name "))
        })

        console.log(" errors lenght 222 : ")

    },
    // check and find the subscriber in database
    (req, res, next) => {

        console.log("check and find the subscriber in database")
        SubscriberDao.CheckisExist(res.locals.subscriber)
            .exec((err, subscriber) => {
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
    /* ********************** middleware to hashing my password */
    (req, res, next) => {
        console.log("password to hash : %s", res.locals.influencer.password)
        bcrypt.hash(res.locals.influencer.password, 10)
            .then((hashed) => {
                res.locals.hashed_pass = hashed
                next()
            })
            .catch((err) => {
                const msg = 'An error was generated while hashing the password'
                console.log("%s => %s", msg, err)
                res.locals.myErrors["password"] = msg
                next(new Error(msg))
            })

    },
    /* *************** middlware to save the email_status ********/
    (req, res, next) => {
        const Email_status = require("../models/email_status")
        const EmailStatusDao = require("../Dao/EmailStatusDao")
        const email_status = new Email_status({
            email: res.locals.subscriber.email
        })

        EmailStatusDao.saveOne(email_status).then(result => {
            if (Object.keys(result).length) {
                confirm_code = result._id
                next()
            } else {
                next(new Error("Can't add the email status"))
            }

        }).catch(err => {
            next(err)
        })

    },
    /* *************** middlware to check ans save the influencer ********/
    (req, res, next) => {
        console.log(res.locals.influencer)
        let influencerToSave = new Influencer({
            ...res.locals.influencer
        })
        influencerToSave.email_status = new Array(confirm_code)
        // console.log("hashed password => %s",res.locals.hashed_pass)
        influencerToSave.password = res.locals.hashed_pass
        console.log("influencerToSave => %s", influencerToSave)
        console.log("influencer form => %s", res.locals.influencer)
        InfluencerDao.signUp(influencerToSave, (err) => {
                if (err) {
                    specialFns.catchErrors(err.errors, res.locals.myErrors)
                    // res.locals.result = "An error was produced during your registration, please contact us"
                    next(err)
                } else {
                    req.session.influencer = influencerToSave
                    next()
                }

            })

    }, (req, res, next) => {
        mailer.send(res.locals.subscriber, res.locals.influencer, confirm_code, next)
    },
    (req, res) => {
        console.log("influencer and saved! new client yéeeey")
        res.clearCookie(process.env.prefix + 'token')
        res.redirect("/dashboard/")
    }
]

const errorController = (err, req, res, next) => {
    console.log(err.stack)
    if (!res.locals.result)
        res.locals.result = helper.translate("account_page.signup.form.result.check_fields")
    res.render("account/sign-up")

}

exports.errorController = errorController
exports.getController = getController
exports.postController = postController