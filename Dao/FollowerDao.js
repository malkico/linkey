const Follower = require("../models/follower")

const addFollower = (ip) => {
    const obj = {
        where: {
            ip_adress: ip
        },
        set: {},
        options: {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }
    }

    console.log("DollowerDao.addFollower => %s ", obj)
    return Follower.findOneAndUpdate(obj.where, obj.set, obj.options)
}
exports.addFollower = addFollower