const express = require("express");
const router = express.Router()

const addLinkCtrl = require("../controllers/addLinkcontroller")
const dashboardCtrl = require("../controllers/dashboardController")
const socialMediaCtrl = require("../controllers/socialMediaController")

router.get("/",dashboardCtrl.get)
router.get("/add-link",addLinkCtrl.get)
router.post("/add-link", addLinkCtrl.post)
router.use("/add-link", addLinkCtrl.error)

router.get('/contact-list',socialMediaCtrl.get)
router.post('/contact-list',socialMediaCtrl.post)
router.delete("/contact-list",socialMediaCtrl.delete)
router.use("/contact-list",socialMediaCtrl.error)

router.get("/all-my-links",function(req, res, next){
    res.render("influencer/all-my-links")
})


module.exports = router