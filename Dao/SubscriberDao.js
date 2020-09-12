const ObjectId = require("mongoose").Types.ObjectId
const Subscriber = require("../models/subscriber")

const saveOne = (subscriber, callback) => {
    console.log("SubscriberDao.saveOne => %s", subscriber)
    return subscriber.save(callback)
}
exports.saveOne = saveOne

const CheckisExist = (subscriber) => {
    const obj = {
        _id: subscriber._id,
        email: subscriber.email
    }
    console.log("SubscriberDao.CheckisExist => %s", obj)
    return Subscriber.findOne(obj)
}
exports.CheckisExist = CheckisExist

const changeFirstNameById = (subscriber, first_name) => {
    const obj = {
        where: {
            _id: ObjectId(subscriber._id)
        },
        set: {
            first_name: first_name
        },
        options: {
            runValidators: true
        }
    }
    console.log("SubscriberDao.changeFirstNameById => %s", obj)
    return Subscriber.findOneAndUpdate(obj.where, obj.set,obj.options)
}
exports.changeFirstNameById = changeFirstNameById

const changeFirstNameByEmail = (subscriber) => {
    const obj = {
        where: {
            email: subscriber.email
        },
        set: {
            first_name: subscriber.first_name
        },
        options: {
            runValidators: true
        }
    }
    console.log("SubscriberDao.changeFirstNameByEmail => %s", obj)
    return Subscriber.findOneAndUpdate(obj.where, obj.set, obj.options)
}
exports.changeFirstNameByEmail = changeFirstNameByEmail
