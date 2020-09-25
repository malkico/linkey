const helper = require("../../config/registerHelper")
const linkConf = require("../../models/config/linkConf")
const {
    check,
    validationResult
} = require('express-validator');
const Link = require('../../models/link')
const specialFncs = require('../../config/specialFunctions');
const page = "influencer/form-link"

module.exports = [

    /* *********************** middleware to initale my page **********/
    (req, res, next) => {
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

        if (errors.length) {
            res.locals.result = helper.translate("dashboard.add_link.form.result.cant_add")
            res.render(page)
            console.log(res.locals.result)
            return
        } else
            next()

    },

    /* ***************** middlwares to escape all my fields ****************/
    check("title").escape(),
]