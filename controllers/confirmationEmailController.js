const URL = "/dashboard/"
const helper = require("../config/registerHelper")
// http://127.0.0.1:3000/account/confirmation/5ee935ae7c8c2f751821facc

const setConfirmationCookie = (res, message, success) => {
    res.cookie(process.env.prefix+"success_email_confirmation", {
        message: message,
        success: success
    }, {
        maxAge: 1000 * 60 * 5 // , // 5minutes
        // secure: "HttpOnly"
    })
}

const Email_status = require("../models/email_status")
exports.get = [
    (req, res, next) => {
        Email_status.findByIdAndUpdate(req.params.code, {
            status: true
        }).then(result => {
            if (Object.keys(result).length)
                next()
            else {
                setConfirmationCookie(res, "Can't confirm your email")
                res.redirect(URL)
            }
        }).catch(err => {
            setConfirmationCookie(res, "An error: "+err)
            console.log("Error => %s" + err.stack)
            res.redirect(URL)
        })
    },
    (req, res, next) => {
        const confirmation_code = req.params.code

        setConfirmationCookie(res, helper.translate("dashboard.index.result.success_email_confirmation", confirmation_code), true)
        res.redirect(URL)
    }
]