

exports.get = (req, res, next) => {
    console.log("req.cookies.success_email_confirmation => %s",req.cookies[process.env.prefix+"success_email_confirmation"])
    res.locals.result = req.cookies[process.env.prefix+"success_email_confirmation"]
    res.locals.page = "home"
    res.clearCookie(process.env.prefix+"success_email_confirmation")
    console.log("req.cookies.success_email_confirmation => %s",req.cookies[process.env.prefix+"success_email_confirmation"])
    res.render("influencer")
}