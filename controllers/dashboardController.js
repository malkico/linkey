

exports.get = (req, res, next) => {
    console.log("req.cookies.success_email_confirmation => %s",req.cookies.success_email_confirmation)
    res.locals.result = req.cookies.success_email_confirmation
    res.clearCookie("success_email_confirmation")
    console.log("req.cookies.success_email_confirmation => %s",req.cookies.sucess_confirmation)
    res.render("influencer")
}