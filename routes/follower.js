const express = require("express")
const router = express.Router()
const followerCtrl = require("../controllers/followerController")

router.get("/:login", followerCtrl.get)

module.exports = router
