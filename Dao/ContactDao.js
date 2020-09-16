const Contact = require("../models/contact")
const addOne = (profile) => {
    
    console.log("ContactDao.addOne => %s", profile)
    return profile.save()
}
exports.addOne = addOne

const deleteById = (idContact) => {
    const obj = {
        _id: idContact
    }
    console.log("ContactDao.deleteById => %s", obj)
    return Contact.deleteOne(obj)
}
exports.deleteById = deleteById