const express = require("express");
const router = express.Router({mergeParams: true})

const addLinkCtrl = require("../controllers/addLinkcontroller")
const dashboardCtrl = require("../controllers/dashboardController")
const socialMediaCtrl = require("../controllers/contactController")
const profileCtrl = require("../controllers/profileController")

router.get("/",dashboardCtrl.get)
router.get("/add-link",addLinkCtrl.get)
router.post("/add-link", addLinkCtrl.post)
router.use("/add-link", addLinkCtrl.error)

router.get('/contact-list',socialMediaCtrl.get)
router.post('/contact-list',socialMediaCtrl.post)
router.delete("/contact-list",socialMediaCtrl.delete)
router.use("/contact-list",socialMediaCtrl.error)

router.get("/profile",profileCtrl.get)
// router.post("/profile/email",profileCtrl.initpost)
router.post("/profile/details",profileCtrl.postDetails)
router.post("/profile/password",profileCtrl.postPassword)

router.get("/all-my-links",function(req, res, next){
    res.render("influencer/all-my-links")
})

router.get('/logout', (req, res, next) => {
    res.clearCookie("token")
    res.redirect("/")
})


module.exports = router