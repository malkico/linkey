const Subscriber = require("../models/subscriber")
const InfluencerDao = require("../Dao/InfluencerDao")
const SubsciberDao = require('../Dao/SubscriberDao')
// const influencerCong = require("../models/config/influencerConf")
const specialFns = require("../config/specialFunctions")

const helper = require("../config/registerHelper")

const {
    check,
    validationResult
} = require('express-validator');

exports.postController = [
    /* ******************** middlwares to check all my fields **************/
    check("first_name").trim().custom(specialFns.checkSpecialChars),
    // check('email').isEmail().normalizeEmail().withMessage(helper.translate("generals.errors.valid_email")),
    // check('email').isEmail().normalizeEmail().withMessage("generals.errors.valid_email"),
    check('email').isEmail().withMessage(() => {
        return helper.translate("generals.errors.valid_email");
    }),
    /* .custom(value => {
        return Subscriber.findOne({
            email: value
        }).then(subs => {
            if (subs) {
                // return new handleError("This email already exist")
                return Promise.reject(new Error("This email already exist"))
            } else
                console.log("this is a new mail");
        })
    }), */
    /* ********************** middleware to initialise all my form with req.body. fields */
    (req, res, next) => {
        res.locals.subscriber = new Subscriber({
            first_name: req.body.first_name,
            email: req.body.email
        });
        console.log("subscriber ====> %s", res.locals.subscriber)
        next()
    },
    /* ********************** middleware to check if there are any errors found on the form */
    (req, res, next) => {
        res.locals.myErrors = {};
        res.locals.result = null
        const errors = validationResult(req).array()
        console.log("validationResult to myErrors");
        errors.forEach(function (e) {
            res.locals.myErrors[e.param] = e.msg;
            console.log(e.param + ' => ' + res.locals.myErrors[e.param]);
        })

        if (!errors.isEmpty && errors.length > 0) {
            const result = 'There is ' + errors.length + ' errors'
            next(new Error(result))
        } else {
            next()
        }
    },

    /* ***************** middlwares to escape all my fields ****************/
    check('niche').escape(),
    check('password').escape(),
    /* (req, res, next) => {
        console.log("creating indexes")
        Subscriber.ensureIndexes( err => { 
             console.log("start creating ...")
            if (err) 
                console.error("Les index n'ont pas pu être créés: %s ", err);

        })

        next()
    }, */
    /* ********************** middleware to find an influencer with this email */
    (req, res, next) => {
        console.log("find an influencer")
        InfluencerDao.findEmail(res.locals.subscriber)
            .exec((err, influencers) => {
                if (err) {
                    res.locals.myErrors["email"] = "Something is wrong with your email, please contact us."
                    next(err)
                } else if (influencers.length) {
                    res.locals.myErrors["email"] = helper.translate("sign_up.form.errors.email_taken")
                    next(new Error(res.locals.myErrors["email"]))
                    // next()
                } else {
                    next()
                }
            })

    },

    /* ***************** middlwares to update the subscriber if found ****************/
    (req, res, next) => {
        console.log("update the subscribe if found")
        SubsciberDao.changeFirstNameByEmail(res.locals.subscriber)
            .exec((err, subscriber) => {
                if (err) {
                    specialFns.catchErrors(err.errors, res.locals.myErrors)
                    // res.locals.result = "An error was produced during your registration, please contact us"
                    next(err)
                } else if (subscriber) {
                    res.locals.subscriber._id = subscriber._id
                    res.locals.subscriber_isUpdated = true
                    next()
                } else {
                    next()
                }
            })
    },
    /* ********************** middleware to save the subscriber in the data base */
    (req, res, next) => {
        console.log("save the subscriber in the data base")
        console.log(res.locals.subscriber)

        if (res.locals.subscriber_isUpdated !== true) {
            SubsciberDao.saveOne(res.locals.subscriber, function (err) {
                if (err) {
                    console.log(err.stack)
                    specialFns.catchErrors(err.errors, res.locals.myErrors)
                    // res.locals.result = "An error was produced during your registration, please contact us"

                    next(err)
                } else {
                    console.log("Subscriber saved! ")
                    next()
                }
            })
        } else
            next()

    },

    /* ***************** The last middleware for redirect to sign-up page ****************/
    (req, res) => {
        req.session.subscriber_signin = res.locals.subscriber
        console.log('Render to sign-up page');

        res.redirect('/sign-up')
    }
]

exports.errorController = (err, req, res, next) => {
    console.log('Render to main page [Error] with POST METHOD');
    console.error(err.stack);
    Object.keys(res.locals.myErrors).forEach(function (key) {
        console.log("%s => %s", key, res.locals.myErrors[key])
    })
    res.render(res.locals.pageErr || "main/index")
}