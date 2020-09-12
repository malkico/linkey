const contactConf = require("../models/config/contactConf")
const Contact = require("../models/contact")
const ContactDao = require("../Dao/ContactDao")
const InfluencerDao = require("../Dao/InfluencerDao")
const page = "influencer/contact-list"
const helper = require("../config/registerHelper")
const {
    check,
    validationResult
} = require("express-validator")
const specialFncs = require("../config/specialFunctions")
const async = require("async")

const initialPage = (req, res, next) => {
    console.log("initiale the page")
    console.log(helper.translate("dashboard.contact_list.form.URL.placeholder.username"))
    res.locals.preURL = contactConf.preURL
    res.locals.icone = contactConf.icone
    res.locals.page = "contact-list"
    res.locals.whichList = {}
    Object.keys(contactConf.which).forEach(key => {
        res.locals.whichList[key] = helper.translate(contactConf.which[key])
    })
    next()
}

const getMyContactList = (req, res, next) => {
    console.log("getMyContactList")
    InfluencerDao.getProfiles(res.locals.influencer)
        .then(result => {
            if (result) {
                const not_allowed = []
                res.locals.which = {}

                /* just display the information channels which are not yet */
                Object.keys(result.contacts).forEach(key => {
                    not_allowed.push(result.contacts[key].which)
                })

                Object.keys(contactConf.which).forEach(key => {
                    if (!not_allowed.includes(key))
                        res.locals.which[key] = contactConf.which[key]
                })

                res.locals.contacts = result.contacts
                next()
            } else {
                res.locals.result = "Can't find your old contact list, if the problem still exists please contact us"
                res.render(page)
                return
            }

        }).catch(err => {
            res.locals.result = "An error was produced while retrieving your contact list, if the problem still exists please contact us"
            console.log("%s <= Error", err)
            res.render(page)
            return
        })
}

exports.get = [
    initialPage,
    getMyContactList,
    (req, res) => {
        res.render(page)
    }
]

exports.post = [
    /* *********************** middleware to initale my page **********/
    initialPage,

    /* *********************** middlewares to check my fields **********/
    check("which").trim(),
    check("URL").trim().custom(specialFncs.checkSpecialCharsURL),

    /* ********************** middleware to initialise all my form with req.body. fields */
    (req, res, next) => {
        console.log("initialise all my form ")
        res.locals.contact = new Contact({
            ...req.body
        })
        next()
    },

    /* **************** initialise my contacts list **********************/
    getMyContactList,

    /* ********************** middleware to check if there are any errors found on the form */
    (req, res, next) => {
        console.log("check if there are any errors")
        res.locals.myErrors = {}
        res.locals.result = null
        const errors = validationResult(req).array()

        errors.forEach(err => {
            res.locals.myErrors[err.param] = err.msg
        });

        if (errors.length) {
            // res.locals.result = "Please check for errors produced"
            res.render(page)
            console.log(res.locals.result)
            return
        } else
            next()

    },

    /* ***************** middlwares to escape all my fields ****************/
    check("URL").escape(),

    /* ************************ Save the new contact information *****************/
    (req, res, next) => {
        async.series({
            addContact: (callback) => {
                ContactDao.addOne(res.locals.contact)
                    .then(result => {
                        if (Object.keys(result).length)
                            callback(null, true)
                        else {
                            res.locals.result = "Can't find the contact you just added, pleaser try again"
                            res.render(page)
                            return
                        }
                    })
                    .catch(
                        (err) => {
                            callback(err, null)
                        }
                    )
            },
            pushToInfluencer: (callback) => {
                InfluencerDao.addSocialProfile(res.locals.influencer, res.locals.contact)
                    .then(result => {
                        if (Object.keys(result).length) {
                            res.locals.contacts.push(res.locals.contact)
                            console.log("filter my contact list on <select>")
                            delete res.locals.which[res.locals.contact.which]
                            callback(null, true)
                        } else {
                            res.locals.result = "Can't update your account, please try again"
                            res.render(page)
                            return
                        }
                    }).catch(err => {
                        callback(err, null)
                    })

            }
        }, (err, results) => {
            if (err) {
                specialFncs.catchErrors(err.errors, res.locals.myErrors)
                res.render(page)
                return
            } else if (results.pushToInfluencer && results.addContact) {
                next()
            } else {
                res.locals.result = "An error! please try again"
                res.render(page)
                return
            }
        })

    },

    /* ************************** The LAST middleware ***************/
    (req, res) => {
        res.locals.result = helper.translate("dashboard.contact_list.form.result.success")
        res.locals.success = true
        res.render(page)
        return
    }
]

exports.error = [
    initialPage,
    (err, req, res) => {
        console.log(err)
        console.log("A error middleware")
        res.render(page)
        return
    }
]

exports.delete = (req, res) => {
    console.log("deleting a contact information...")
    const idContact = req.body.id
    console.log("id = %s", idContact)
    let message = null
    async.series({
        removeFromInfluencer: (callback) => {
            console.log("removeFromInfluencer = %s", idContact)
            InfluencerDao.removeSocialProfile(res.locals.influencer, idContact)
                .then(result => {
                    if (result.nModified) {
                        console.log("The contact is pulled from your account")
                        callback(null, true)
                    } else {
                        message = "Can't pull the contact from your account"
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
            ContactDao.deleteById(idContact)
                .then(result => {
                    if (result.deletedCount) {
                        console.log("contact removed!")
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
            message = "Contact deleted!"
            console.log(message)
            res.status(200).json({
                message: message,
                success: true
            }, )
        }
    })

}