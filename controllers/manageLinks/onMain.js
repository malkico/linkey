const LinkDao = require("../../Dao/LinkDao")

module.exports = [
    (req, res, next) => {
        console.log("%s make it on main : %s", req.body.link_id, req.body.main)
        LinkDao.changeMain(req.body.link_id, req.body.main)
            .then(result => {
                if (result.nModified) {
                    res.status(200).json({
                        message: "the link selected on main now!",
                        success: true
                    })
                } else {
                    console.log("result => %s", result)
                    res.status(500).json({
                        message: "Can't update the link"
                    })
                }
            }).catch(err => {
                console.log("err => %s", err)
                res.status(500).json({
                    message: "An error producing on modifying the link"
                })
            })

    }
]