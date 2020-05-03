const express = require("express");
const router = express.Router()

const addLinkController = require("../controllers/addLinkcontroller")

router.get("/",function(req, res, next){
    res.render("influencer")
})
router.get("/add-link",addLinkController.addLinkController)
router.post("/add-link", addLinkController.addLinkPostController)
router.get("/all-my-links",function(req, res, next){
    res.render("influencer/all-my-links")
})


module.exports = router