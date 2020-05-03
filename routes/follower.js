const express = require("express")
const router = express.Router()

router.get("/", function(req,res,next){
    res.render("follower/index", {
        title : 'a follower title',
        links : [457,4,854,7987,445,6464]
    })
})

module.exports = router
