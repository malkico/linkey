const express = require("express");
const router = express.Router()

const addLinkCtrl = require("../controllers/addLinkcontroller")
const dashboardCtrl = require("../controllers/dashboardController")

router.get("/",dashboardCtrl.get)
router.get("/add-link",addLinkCtrl.get)
router.post("/add-link", addLinkCtrl.post)
router.use("/add-link", addLinkCtrl.error)
router.get("/all-my-links",function(req, res, next){
    res.render("influencer/all-my-links")
})


module.exports = router