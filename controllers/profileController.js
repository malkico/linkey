exports.get = (req, res, next) => {
    res.locals.page = "profile"
    res.render("influencer/profile")
}