const page = "influencer/form-link"
const helpers = require("../../config/registerHelper")

module.exports =  [
    (req, res, next) => {
        res.locals.page = "all-my-links"
        res.locals.page_title = helpers.translate("dashboard.add_link.page_title")
        res.render(page)
    }
]