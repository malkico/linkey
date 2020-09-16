const async = require("async")
const InfluencerDao = require("../../Dao/InfluencerDao")

module.exports = (req, res, next) => {
    console.log("deleting a contact information...")
    const link_id = req.body.link_id
    console.log("link_id = %s", link_id)
    let message = null
    async.series({
        removeFromInfluencer: (callback) => {
            console.log("removeFromInfluencer = %s", link_id)
            InfluencerDao.removeLink(res.locals.influencer, link_id)
                .then(result => {
                    if (result.nModified) {
                        console.log("The link is pulled from your account")
                        callback(null, true)
                    } else {
                        message = "Can't pull the link from your account"
                        console.log(message)
                        res.status(202).json({
                            message: message
                        })
                    }
                }).catch(err => {
                    callback(err, null)
                })

        },
        removeContact: (callback) => {
            const LinkDao = require("../../Dao/LinkDao")
            LinkDao.deleteById(link_id).then(result => {
                    if (result.deletedCount) {
                        console.log("link removed!")
                        callback(null, true)
                    } else {
                        message = "Can't remove this!"
                        console.log(message)
                        res.status(202).json({
                            message: message
                        })
                    }
                })
                .catch(err => {
                    callback(err, null)
                })
        }
    }, (err, results) => {
        if (err) {
            message = "Can't delete this, please try again"
            console.log("%s - %s", err, message)
            res.status(202).json({
                message: message
            })
        } else if (results) {
            message = "Link deleted!"
            console.log(message)
            res.status(200).json({
                message: message,
                success: true
            }, )
        }
    })

}