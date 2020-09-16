const ObjectId = require('mongoose').Types.ObjectId
const Link = require("../models/link")

const update = (_id, link) => {
    const obj = {
        _id: ObjectId(_id),
        set: {
            $set: {
                main: link.main,
                KEY: link.KEY,
                title: link.title,
                URL: link.URL,
                date_modification: new Date().toISOString()
            }
        },
        options: {
            new: false,
            runValidators: true
        }
    }

    console.log("LinkDao.update => %s", obj)
    return Link.findByIdAndUpdate( obj._id, obj.set, obj.options)
}
exports.update = update

const saveTempOne = (obj) => {
    console.log("LinkDao.saveOne => %s", obj)
    return obj.save()
}
exports.saveTempOne = saveTempOne

const findById = (_id) => {
    const obj = _id
    console.log("LinkDao.findById => %s", obj)
    return Link.findById(obj)
}
exports.findById = findById

const changeMain = (_id, main) => {
    const obj = {
        where: {
            _id: ObjectId(_id)
        },
        set: {
            main: main,
            date_modification: new Date().toISOString()
        },
        options: {
            runValidators: true
        }
    }
    console.log("LinkDao.changeMain => %s", obj)
    return Link.updateOne(obj.where, obj.set, obj.options)
}
exports.changeMain = changeMain

const deleteById = (_id) => {
    const obj = {
        _id: _id
    }
    console.log("LinkDao.deleteById => %s",obj)
    return Link.deleteOne(obj)
}
exports.deleteById = deleteById