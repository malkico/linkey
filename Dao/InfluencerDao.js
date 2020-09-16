const ObjectId = require('mongoose').Types.ObjectId;
const Influencer = require("../models/influencer")

const findById = (influencer) => {
    const obj = {
        _id: influencer._id
    }
    console.log("InfluencerDao.findById => %s", obj)
    return Influencer.findOne(obj).populate("contacts")
}
exports.findById = findById

const checkKeyAlreadyExist = (influencer, link) => {
    const obj = [{
        $lookup: {
            from: "links",
            localField: "links",
            foreignField: "_id",
            as: "links",
        }
    }, {
        $match: {
            _id: ObjectId(influencer._id),
            "links.KEY": link.KEY
        }
    }]
    console.log("InfluencerDao.checkKeyAlreadyExist => %s", obj)
    return Influencer.aggregate(obj)
}
exports.checkKeyAlreadyExist = checkKeyAlreadyExist

const addLink = (influencer, link) => {
    const obj = {
        where: {
            _id: influencer._id
        },
        set: {
            $push: {
                links: link
            }
        },
        options: {
            runValidators: true
        }
    }
    console.log("InfluencerDao.addLink => %s", obj)
    return Influencer.updateOne(obj.where, obj.set, obj.options)

}
exports.addLink = addLink

const getProfiles = (influencer) => {
    const obj = influencer._id
    console.log("InfluencerDao.getProfiles => %s", obj)

    return Influencer.findById(obj).sort({}).populate("contacts")
}
exports.getProfiles = getProfiles

const addSocialProfile = (influencer, contact) => {
    const obj = {
        where: {
            _id: influencer._id
        },
        set: {
            $push: {
                contacts: contact
            }
        }
    }

    console.log("InfluencerDao.addSocialProfile => %s", obj)
    return Influencer.updateOne(obj.where, obj.set)

}
exports.addSocialProfile = addSocialProfile

const removeSocialProfile = (influencer, idContact) => {
    const obj = {
        where: {
            _id: influencer._id
        },
        set: {
            $pull: {
                contacts: ObjectId(idContact)
            }
        }
    }
    console.log("InfluencerDao.removeSocialProfile => %s", obj)
    return Influencer.updateOne(obj.where, obj.set)
}
exports.removeSocialProfile = removeSocialProfile

const getLinks = (login) => {
    const obj = {
        where: {
            login: login
        },
        options: {
            sort: {
                date_modification: -1
            }
        }
    }
    console.log("InfluencerDao.getLinks => %s", obj)
    return Influencer.findOne(obj.where).populate("links", "", null, obj.options).populate("contacts")
}
exports.getLinks = getLinks

const findEmail = (influencer) => {
    const obj = [{
            $lookup: {
                from: 'subscribers',
                localField: 'subscriber',
                foreignField: '_id',
                as: 'subscriber'
            }
        },
        {
            $match: {
                "subscriber.email": influencer.email
            }
        }, {
            $unwind: {
                "path": "$subscriber"
            }
        }
    ]
    console.log("InfluencerDao.findEmail => %s", obj)

    return Influencer.aggregate(obj)
}
exports.findEmail = findEmail

const getAllLinks = (influencer) => {
    const obj = [{
        $lookup: {
            from: "links",
            localField: "links",
            foreignField: "_id",
            as: "links"
        }
    }, {
        $match: {
            _id: ObjectId(influencer._id)
        }
    }]
    console.log("InfluencerDao.getLinks => %s", obj)

    return Influencer.aggregate(obj)

}
exports.getAllLinks = getAllLinks

const removeLink = (influencer, link_id) => {
    const obj = {
        where: {
            _id: influencer._id
        },
        set: {
            $pull: {
                links: ObjectId(link_id)
            }
        }
    }

    console.log("InfluencerDao.removeLink => %s", obj)
    return Influencer.updateOne(obj.where, obj.set)
}

exports.removeLink = removeLink

// check if the influencer have already this link 
const checkLink = (influencer, link_id) => {
    const obj = [{
        $lookup: {
            from: "links",
            localField: "links",
            foreignField: "_id",
            as: "links"
        }
    }, {
        $match: {
            _id: ObjectId(influencer._id),
            "links._id": ObjectId(link_id)
        }
    }]

    console.log("InfluencerDao.checkLink => %s", obj)
    return Influencer.aggregate(obj    )
}
exports.checkLink = checkLink

const changeDetails = (influencer, data) => {

    const obj = {
        where: {
            _id: ObjectId(influencer._id, data),
        },
        set: {
            $set: {
                last_name: data.last_name,
                login: data.login,
                niche: data.niche,
                character: data.character
            }
            // ...req.boy
        },
        options: {
            new: false,
            runValidators: true
        }
    }

    console.log("InfluencerDao.changeDetails => %s", obj)
    return Influencer.findOneAndUpdate(obj.where, obj.set, obj.options)
}
exports.changeDetails = changeDetails

const changePassword = (influencer, password) => {
    const obj = {
        where: {
            _id: ObjectId(influencer._id)
        },
        set: {
            password: password
        },
        options: {
            runValidators: true
        }
    }

    console.log("InfluencerDao.changePassword => ", obj)
    return Influencer.updateOne(obj.where, obj.set, obj.options)
}
exports.changePassword = changePassword

const signUp = (influencer, callback) => {
    console.log("Influencer.signUp => %s", influencer)
    return influencer.save(callback)
}
exports.signUp = signUp