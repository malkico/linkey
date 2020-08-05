const ObjectId = require("mongoose").Types.ObjectId
const Link = require("../../models/link")

module.exports = [
    (req, res, next) => {
        console.log("%s make it on main : %s", req.body.link_id, req.body.main)
        Link.updateOne({
            _id: ObjectId(req.body.link_id)
        }, {
            main: req.body.main
        }, {
            runValidators: true
        }).then(result => {
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
