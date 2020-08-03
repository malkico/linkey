const express = require("express");
const router = express.Router({mergeParams: true})

const addLinkCtrl = require("../controllers/addLinkcontroller")
const dashboardCtrl = require("../controllers/dashboardController")
const socialMediaCtrl = require("../controllers/contactController")
const profileCtrl = require("../controllers/profileController")
const allLinksCtr = require("../controllers/allLinksController")

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

router.get("/all-my-links",allLinksCtr.get)
router.post("/all-my-links/on_main",allLinksCtr.on_main)
router.post("/all-my-links/remove",allLinksCtr.remove)
router.get("/links/update/:link_id",allLinksCtr.update)

router.get('/logout', (req, res, next) => {
    res.clearCookie("token")
    res.redirect("/")
})


module.exports = router