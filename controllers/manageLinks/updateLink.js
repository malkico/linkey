const page = "influencer/form-link"
const helpers = require("../../config/registerHelper")
const Link = require("../../models/link")
const Influencer = require("../../models/influencer")
const specialFncs = require('../../config/specialFunctions')
const ObjectId = require("mongoose").Types.ObjectId

exports.get = [
    /* ********************* initiale page ************* */
    (req, res, next) => {
        res.locals.page = "all-my-links"
        res.locals.page_title = helpers.translate("dashboard.update_link.page_title")
        res.locals.submit = helpers.translate("dashboard.update_link.form.submit")
        next()
    },
    (req, res, next) => {
        Link.findById(req.params.link_id)
            .then(result => {
                console.log(result)
                if (result) {
                    res.locals.link = result
                    next()
                } else {
                    res.locals.result = "Can't find the link"
                    res.render(page)
                    return
                }
            }).catch(err => {
                console.log("error => %s", err)
                res.locals.result = 'An error occurred while charging the data '
            })

    },
    (req, res, next) => {
        res.render(page)
    }
]

exports.post = [
    /* *********************** middleware to initale my page **********/
    (req, res, next) => {
        res.locals.page = "all-my-links"
        res.locals.page_title = helpers.translate("dashboard.update_link.page_title")
        res.locals.submit = helpers.translate("dashboard.update_link.form.submit")
        next()
    },
    require("../manageLinks/init_middlwares_aLink"),

    (req, res, next) => {
        // ** ***************** check if the influencer have already this link ***************
        console.log("influencer => %s", res.locals.influencer._id)
        console.log("link => %s", req.params.link_id)
        Influencer.aggregate([{
                $lookup: {
                    from: "links",
                    localField: "links",
                    foreignField: "_id",
                    as: "links"
                }
            }, {
                $match: {
                    _id: ObjectId(res.locals.influencer._id),
                    "links._id": ObjectId(req.params.link_id)
                }
            }]

        ).then((result) => {
            // console.log("check a result: %s", JSON.stringify(result))
            if (!Object.keys(result).length) {
                res.locals.result = helpers.translate("dashboard.update_link.form.result.not_yours")
                res.render(page)
                return
            } else {
                const myOtherLinks = result[0].links.filter(link => link._id != req.params.link_id)
                const findKEY = myOtherLinks.filter(link => link.KEY == req.body.KEY)

                // ******** Check if the influencer has already use this KEY ******
                if (findKEY.length) {
                    res.locals.result = helpers.translate("dashboard.add_link.form.result.KEY")
                    res.locals.myErrors.KEY = helpers.translate("dashboard.add_link.form.KEY.errors.Duplicated")
                    res.render(page)
                    return
                } else
                    next()
            }

        }).catch(err => {
            res.locals.result = "Error! Cannot check the link id"
            console.log("errors => %s", err)
            res.render(page)
            return
        })

    },

    /* ***************** middlwares to update the link ****************/
    (req, res, next) => {
        console.log("update the link")
        Link.findByIdAndUpdate(
                ObjectId(req.params.link_id), {
                    $set: {
                        main: res.locals.link.main,
                        KEY: res.locals.link.KEY,
                        title: res.locals.link.title,
                        URL: res.locals.link.URL
                    }
                }, {
                    new: false,
                    runValidators: true
                })
            .then(result => {
                if (!result) {
                    res.locals.result = "Cant't find the link you just updated in DB"
                    res.render(page)
                    return
                } else {
                    console.log("link updated!")
                    console.log("result => %s", result)
                    res.locals.result = helpers.translate("dashboard.update_link.form.result.success")
                    res.locals.success = true
                    next()
                }
            })
            .catch(err => {
                res.locals.result = helpers.translate("dashboard.update_link.form.result.cant_update")
                specialFncs.catchErrors(err.errors, res.locals.myErrors)
                console.log("%s \n %s", err, res.locals.result)
                res.render(page)
                return

            })
    },

    (req, res, next) => {
        res.render(page)
    }
]