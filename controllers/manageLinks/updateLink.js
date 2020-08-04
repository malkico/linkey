const page = "influencer/form-link"
const helpers = require("../../config/registerHelper")
const Link = require("../../models/link")

exports.get =  [
    /* ********************* initiale page ************* */
    (req, res, next) => {
        res.locals.page = "all-my-links"
        res.locals.page_title = helpers.translate("dashboard.update_link.page_title")
        res.locals.submit = helpers.translate("dashboard.update_link.form.submit")
        next()
    },
    (req, res, next) => {
        Link.findById(req.params.link_id)
        .then(result => {
            console.log(result)
            if(result._id){
                res.locals.link = result
                next()
            }
            else{
                res.locals.result = "Can't find the link"
                res.render(page)
                return
            }
        }).catch(err => {
            console.log("error => %s", err)
            res.locals.result = 'An error occurred while charging the data '
        })
        
    },
    (req, res, next) => {
        res.render(page)
    }
]

exports.post = [
    /* *********************** middleware to initale my page **********/
    (req, res, next) => {
        res.locals.page = "all-my-links"
        res.locals.page_title = helpers.translate("dashboard.update_link.page_title")
        res.locals.submit = helpers.translate("dashboard.update_link.form.submit")
        next()
    },
    require("../manageLinks/init_middlwares_aLink"),

    /* ***************** middlwares to save the new link ****************/
    (req, res, next) => {
        next()
    },

    require("./manageLinks/init_middlwares_aLink"),
    (req, res, next) => {
        res.render(page)
    }
]