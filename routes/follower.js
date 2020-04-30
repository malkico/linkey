const express = require("express")
const router = express.Router()

router.get("/", function(req,res,next){
    res.render("follower/index", {
        title : 'a follower title',
        links : [457,787,44854,487,987,54,748]
    })
})

module.exports = router
